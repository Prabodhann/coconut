import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addToCart(userId: string, itemId: string) {
    const userData = await this.userModel.findById(userId);
    if (!userData) return { success: false, message: 'User not found' };
    const cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await this.userModel.findByIdAndUpdate(userId, { cartData });
    return { success: true, message: 'Added To Cart' };
  }

  async removeFromCart(userId: string, itemId: string) {
    const userData = await this.userModel.findById(userId);
    if (!userData) return { success: false, message: 'User not found' };
    const cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    await this.userModel.findByIdAndUpdate(userId, { cartData });
    return { success: true, message: 'Removed From Cart' };
  }

  async getCart(userId: string) {
    const userData = await this.userModel.findById(userId);
    if (!userData) return { success: false, message: 'User not found' };
    const cartData = userData.cartData || {};
    return { success: true, cartData };
  }
}
