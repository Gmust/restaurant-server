import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChangeEventDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  eventId: string;
}
