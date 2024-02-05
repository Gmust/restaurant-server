import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { DishCategories } from '../../types/dish';

export class CreateDishDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  price: number;

  @IsNotEmpty()
  preparationTime: string;

  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => {
    return Array(JSON.parse(value));
  })
  ingredients: string[];

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return Boolean(value);
  })
  isVegan: boolean;

  @IsNotEmpty()
  @IsEnum(DishCategories)
  category;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  dishWeight: number;
}
