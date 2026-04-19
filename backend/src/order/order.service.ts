import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PlaceOrderDto } from './dto/order.dto';

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        apiVersion: '2023-10-16' as any,
      },
    );
  }

  async placeOrder(orderDto: PlaceOrderDto) {
    // DTO ValidationPipe inherently replaces the isNaN(amount) and item.quantity scans
    const { userId, items, amount, address, orderId } = orderDto;

    const newOrder = new this.orderModel({
      userId,
      items,
      amount,
      address,
      orderId,
    });

    await newOrder.save();
    await this.userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map(
      (item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'inr',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }),
    );

    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Delivery Charge' },
        unit_amount: 5 * 100,
      },
      quantity: 1,
    });

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    const orderIdStr = newOrder._id.toString();
    const session = await this.stripe.checkout.sessions.create({
      success_url: `${frontendUrl}/verify?success=true&orderId=${orderIdStr}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${orderIdStr}`,
      line_items: line_items,
      mode: 'payment',
    });

    return { success: true, session_url: session.url };
  }

  async listOrders() {
    const orders = await this.orderModel.find({});
    return { success: true, data: orders };
  }

  async userOrders(userId: string) {
    const orders = await this.orderModel.find({ userId });
    return { success: true, data: orders };
  }

  async updateStatus(orderId: string, status: string) {
    await this.orderModel.findByIdAndUpdate(orderId, { status });
    return { success: true, message: 'Status Updated' };
  }

  async verifyOrder(orderId: string, success: string) {
    if (success === 'true') {
      await this.orderModel.findByIdAndUpdate(orderId, { payment: true });
      return { success: true, message: 'Paid' };
    } else {
      await this.orderModel.findByIdAndDelete(orderId);
      return { success: false, message: 'Not Paid' };
    }
  }
}
