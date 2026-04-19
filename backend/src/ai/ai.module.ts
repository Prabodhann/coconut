import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { Food, FoodSchema } from '../food/schemas/food.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
