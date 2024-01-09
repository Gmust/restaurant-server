import { IsArray, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

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
  description: string;
}
