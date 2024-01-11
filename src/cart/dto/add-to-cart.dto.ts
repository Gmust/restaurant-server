import { IsNotEmpty, IsNumber } from 'class-validator';
import { ObjectId } from 'mongoose';

import { DishDocument } from '../../schemas/dish.schema';

export class AddToCartDto {
  @IsNotEmpty()
  _id: ObjectId;

  @IsNotEmpty()
  dish: DishDocument;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
