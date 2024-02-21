import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayNotEmpty, IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';
import mongoose, { Document } from 'mongoose';

import { Statuses } from '../types/order';

export type GuestOrderDocument = Document & GuestOrder;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class GuestOrder {
  @Prop({
    type: String,
    required: [true, 'Email is required for order!'],
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Prop({ type: String, enum: Object.values(Statuses), default: Statuses.pending })
  @IsEnum(Statuses)
  status: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'OrderItem' }] })
  @ArrayNotEmpty({ message: 'At least one order item is required ' })
  orderItems: mongoose.Types.ObjectId[];

  @Prop({ type: Number, required: [true, 'Total price is required'] })
  @IsNumber({}, { message: 'Total price must be a number' })
  totalPrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' })
  @IsOptional()
  promoCode: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Boolean, required: [true, 'Please check if you would like takeaway.'] })
  takeaway: boolean;

  @Prop({ type: String, required: [true, 'Order number is required'] })
  orderNumber: string;

  @Prop({ type: String, required: [true, 'confirmation token is required'] })
  confirmationToken: string;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;
}

export const GuestOrderSchema = SchemaFactory.createForClass(GuestOrder);
