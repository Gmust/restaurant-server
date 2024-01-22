import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CancelReservationDto {
  @IsNotEmpty()
  @IsNumber()
  table;

  @IsNotEmpty()
  @IsEmail()
  email;
}
