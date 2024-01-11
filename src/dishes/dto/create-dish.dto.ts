import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { DishCategories } from '../../types/dish';

export class CreateDishDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  preparationTime: string;

  @IsNotEmpty()
  @IsArray()
  ingredients: string[];

  @IsNotEmpty()
  @IsBoolean()
  isVegan: boolean;

  @IsNotEmpty()
  @IsEnum(DishCategories)
  category;

  @IsNotEmpty()
  description: string;
}
