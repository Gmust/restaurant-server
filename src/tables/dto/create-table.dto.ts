import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTableDto {
  @IsNotEmpty()
  @IsNumber()
  tableNum: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfSeats: number;

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}
