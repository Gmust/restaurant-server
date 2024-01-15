import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop({ type: Number, required: [true, 'At least 1 item is required'], default: 1 })
  quantity: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: [true, 'Dish is required'],
  })
  dish: mongoose.Schema.Types.ObjectId;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
