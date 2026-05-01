import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { AddFoodDto, RemoveFoodDto, EditFoodDto } from './dto/food.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('add')
  @UseGuards(AdminGuard)
  addFood(@Body() body: AddFoodDto) {
    return this.foodService.addFood(body);
  }

  @Get('list')
  listFood() {
    return this.foodService.listFood();
  }

  @Post('remove')
  @UseGuards(AdminGuard)
  removeFood(@Body() body: RemoveFoodDto) {
    return this.foodService.removeFood(body.id);
  }

  @Post('edit')
  @UseGuards(AdminGuard)
  editFood(@Body() body: EditFoodDto) {
    return this.foodService.editFood(body);
  }
}
