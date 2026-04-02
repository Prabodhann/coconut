import { Controller, Post, Get, Body } from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('add')
  async addFood(@Body() body: any) {
    if (!body.imageData) {
      return { success: false, message: 'Image is required' };
    }
    return this.foodService.addFood(body);
  }

  @Get('list')
  async listFood() {
    return this.foodService.listFood();
  }

  @Post('remove')
  async removeFood(@Body() body: { id: string }) {
    if (!body.id) {
      return { success: false, message: 'ID is required' };
    }
    return this.foodService.removeFood(body.id);
  }
}
