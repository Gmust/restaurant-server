import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
    required: [true, 'Dishes is required'],
  })
  @ArrayNotEmpty({ message: 'At least one dish is required in the cart' })
  @IsArray({ message: 'Dishes must be an array' })
  dishes: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  @IsNumber({}, { message: 'Total price must be a number' })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
