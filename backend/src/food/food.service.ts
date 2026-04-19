import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { v2 as cloudinary } from 'cloudinary';
import { AddFoodDto, EditFoodDto } from './dto/food.dto';

@Injectable()
export class FoodService {
  constructor(@InjectModel(Food.name) private foodModel: Model<FoodDocument>) {}

  async addFood(foodDto: AddFoodDto) {
    const { name, description, price, category, imageData } = foodDto;

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
  }

  async listFood(): Promise<any> {
    const foods = await this.foodModel.find({});
    return { success: true, data: foods };
  }

  async removeFood(id: string): Promise<any> {
    const food = await this.foodModel.findById(id);
    if (!food) {
      return { success: false, message: 'Food not found' };
    }

    if (food.cloudinaryId) {
      await cloudinary.uploader.destroy(food.cloudinaryId);
    }

    await this.foodModel.findByIdAndDelete(id);
    return { success: true, message: 'Food Removed' };
  }

  async editFood(foodDto: EditFoodDto): Promise<any> {
    const { id, name, description, price, category, imageData } = foodDto;

    const food = await this.foodModel.findById(id);
    if (!food) {
      return { success: false, message: 'Food not found' };
    }

    if (name) food.name = name;
    if (description) food.description = description;
    if (price !== undefined) food.price = Number(price);
    if (category) food.category = category;

    if (imageData) {
      // Clean up old image if possible natively
      if (food.cloudinaryId) {
        await cloudinary.uploader.destroy(food.cloudinaryId);
      }

      const uploadResult = await cloudinary.uploader.upload(imageData, {
        folder: 'coconut/foods',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      });

      food.image = uploadResult.secure_url;
      food.cloudinaryId = uploadResult.public_id;
    }

    await food.save();
    return { success: true, message: 'Food Updated Successfully' };
  }
}
