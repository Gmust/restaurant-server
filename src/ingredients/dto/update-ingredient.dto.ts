import { IsNotEmpty, IsNumber } from 'class-validator';

import { Units } from '../../types/ingredient';

export class UpdateIngredientDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  unit: Units;
}
