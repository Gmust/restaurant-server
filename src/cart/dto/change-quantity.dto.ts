import { IsNotEmpty, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class ChangeQuantityDto {
  @IsNotEmpty()
  cartId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  cartItemId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  newQuantity: number;
}
