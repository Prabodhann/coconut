import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriberDocument = Subscriber & Document;

@Schema({ collection: 'subscribers' })
export class Subscriber {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ default: () => new Date() })
  subscribedAt: Date;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
