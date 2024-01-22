import { IsDateString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  timeOfReservation: Date;

  @IsNotEmpty()
  @IsNumber()
  table: number;

  @IsNotEmpty()
  @IsNumber()
  amountOfVisitors: number;

  @IsNumber()
  @IsEmail()
  email: string;
}
