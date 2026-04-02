import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ collection: 'orders' })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  items: any[];

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Object, required: true })
  address: any;

  @Prop({ default: 'Food Processing' })
  status: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ default: false })
  payment: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
