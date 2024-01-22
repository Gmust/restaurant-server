import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ChangeReservationDataDto {
  @IsOptional()
  @IsDateString()
  timeOfReservation: Date;

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
}
