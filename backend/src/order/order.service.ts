import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2023-10-16' as any,
      },
    );
  }

  async placeOrder(orderDto: any) {
    try {
      const { userId, items, amount, address } = orderDto;

      if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Invalid amount' };
      }

      for (const item of items) {
        if (!item.name || isNaN(item.quantity) || item.quantity <= 0) {
          return { success: false, message: 'Invalid item data' };
        }
      }

      const newOrder = new this.orderModel({
        userId,
        items,
        amount,
        address,
      });
      await newOrder.save();
      await this.userModel.findByIdAndUpdate(userId, { cartData: {} });

      const line_items = items.map((item: any) => ({
        price_data: {
          currency: 'inr',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Delivery Charge' },
          unit_amount: 5 * 100,
        },
        quantity: 1,
      });

      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:5173';
      const session = await this.stripe.checkout.sessions.create({
        success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
        line_items: line_items,
        mode: 'payment',
      });

      return { success: true, session_url: session.url };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  }

  async listOrders() {
    try {
      const orders = await this.orderModel.find({});
      return { success: true, data: orders };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error' };
    }
  }

  async userOrders(userId: string) {
    try {
      const orders = await this.orderModel.find({ userId });
      return { success: true, data: orders };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error' };
    }
  }

  async updateStatus(orderId: string, status: string) {
    try {
      await this.orderModel.findByIdAndUpdate(orderId, { status });
      return { success: true, message: 'Status Updated' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error' };
    }
  }

  async verifyOrder(orderId: string, success: string) {
    try {
      if (success === 'true') {
        await this.orderModel.findByIdAndUpdate(orderId, { payment: true });
        return { success: true, message: 'Paid' };
      } else {
        await this.orderModel.findByIdAndDelete(orderId);
        return { success: false, message: 'Not Paid' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Not Verified' };
    }
  }
}
