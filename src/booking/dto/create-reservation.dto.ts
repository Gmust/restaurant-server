import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { ReservationTime } from '../../types/booking';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsEnum(ReservationTime)
  timeOfReservation: ReservationTime;

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
