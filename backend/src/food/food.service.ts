import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FoodService {
  constructor(@InjectModel(Food.name) private foodModel: Model<FoodDocument>) {}

  async addFood(foodDto: any): Promise<any> {
    const { name, description, price, category, imageData } = foodDto;
    try {
      const uploadResult = await cloudinary.uploader.upload(imageData, {
        folder: 'coconut/foods',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      });

      const food = new this.foodModel({
        name,
        description,
        price: Number(price),
        category,
        image: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
      });

      await food.save();
      return { success: true, message: 'Food Added' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error adding food item');
    }
  }

  async listFood(): Promise<any> {
    try {
      const foods = await this.foodModel.find({});
      return { success: true, data: foods };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching food list');
    }
  }

  async removeFood(id: string): Promise<any> {
    try {
      const food = await this.foodModel.findById(id);
      if (!food) {
        return { success: false, message: 'Food not found' };
      }

      if (food.cloudinaryId) {
        await cloudinary.uploader.destroy(food.cloudinaryId);
      }

      await this.foodModel.findByIdAndDelete(id);
      return { success: true, message: 'Food Removed' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error removing food item');
    }
  }
}
