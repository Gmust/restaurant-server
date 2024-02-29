import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { ReservationTime } from '../../types/booking';

export class ChangeReservationDataDto {
  @IsOptional()
  @IsEnum(ReservationTime)
  timeOfReservation: ReservationTime;

  @IsNotEmpty()
  @IsNumber()
  table;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  newTable;

  @IsOptional()
  @IsNumber()
  amountOfVisitors;

  @IsNumber()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  reservationId: string;
}
