import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { Statuses } from '../types/order';

export type OrderDocument = Order & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Order {
  @Prop({ type: String, enum: Object.values(Statuses), default: Statuses.pending })
  @IsEnum(Statuses)
  status: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'OrderItem' }] })
  @ArrayNotEmpty({ message: 'At least one order item is required ' })
  orderItems: mongoose.Types.ObjectId[];

  @Prop({ type: Number, required: [true, 'Total price is required'] })
  @IsNotEmpty({ message: 'Total price is required' })
  @IsNumber({}, { message: 'Total price must be a number' })
  totalPrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' })
  @IsOptional()
  promoCode: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Boolean, required: [true, 'Please check if you would like takeaway.'] })
  takeaway: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
