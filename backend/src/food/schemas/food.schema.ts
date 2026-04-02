import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FoodDocument = Food & Document;

@Schema({ collection: 'foods' })
export class Food {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop()
  cloudinaryId: string;

  @Prop({ required: true })
  category: string;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
