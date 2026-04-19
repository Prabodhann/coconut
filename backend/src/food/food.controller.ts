import { Controller, Post, Get, Body } from '@nestjs/common';
import { FoodService } from './food.service';
import { AddFoodDto, RemoveFoodDto, EditFoodDto } from './dto/food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('add')
  addFood(@Body() body: AddFoodDto) {
    return this.foodService.addFood(body);
  }

  @Get('list')
  listFood() {
    return this.foodService.listFood();
  }

  @Post('remove')
  removeFood(@Body() body: RemoveFoodDto) {
    return this.foodService.removeFood(body.id);
  }

  @Post('edit')
  editFood(@Body() body: EditFoodDto) {
    return this.foodService.editFood(body);
  }
}
