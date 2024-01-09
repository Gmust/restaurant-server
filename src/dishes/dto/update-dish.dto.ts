import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

import { DishCategories } from '../../types/dish';

export class UpdateDishDto {
  @IsNotEmpty()
  _id;

  name: string;

  price: number;

  preparationTime: string;

  ingredients: ObjectId[];

  isVegan: boolean;

  isAvailable: boolean;

  description: string;

  category: DishCategories;
}
