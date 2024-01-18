import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTableDto {
  @IsNotEmpty()
  tableId: string;

  @IsOptional()
  tableNum: number;

  @IsOptional()
  numberOfSeats: number;

  @IsOptional()
  isAvailable: boolean;
}
