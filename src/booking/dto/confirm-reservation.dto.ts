import { IsBoolean, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmReservationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  table: number;

  @IsNotEmpty()
  @IsBoolean()
  confirmed: boolean;

  @IsNotEmpty()
  reservationId: string;
}
