import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

import { DishCategories } from '../../types/dish';

export class UpdateDishDto {
  @IsNotEmpty()
  _id;

  @IsOptional()
  name: string;

  @IsOptional()
  price: number;

  @IsOptional()
  preparationTime: string;

  @IsOptional()
  ingredients: ObjectId[];

  @IsOptional()
  isVegan: boolean;

  @IsOptional()
  isAvailable: boolean;

  @IsOptional()
  description: string;

  @IsOptional()
  category: DishCategories;

  @IsOptional()
  dishWeight: number;
}
