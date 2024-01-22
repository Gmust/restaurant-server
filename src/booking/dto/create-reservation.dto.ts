import { IsDateString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  timeOfReservation: Date;

  @IsNotEmpty()
  @IsNumber()
  table;

  @IsNotEmpty()
  @IsNumber()
  amountOfVisitors;

  @IsNumber()
  @IsEmail()
  email: string;
}
