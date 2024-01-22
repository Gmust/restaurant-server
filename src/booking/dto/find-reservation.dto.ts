import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class FindReservationDto {
  @IsNotEmpty()
  @IsNumber()
  table: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
