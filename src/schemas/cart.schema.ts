import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem', default: [] }],
  })
  cartItems: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  @IsNumber({}, { message: 'Total price must be a number' })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
