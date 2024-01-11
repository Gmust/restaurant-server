import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class RemoveFromCartDto {
  @IsNotEmpty()
  cartId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  cartItemId: mongoose.Schema.Types.ObjectId;
}
