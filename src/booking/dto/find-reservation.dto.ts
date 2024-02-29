import { IsNotEmpty } from 'class-validator';

export class FindReservationDto {
  @IsNotEmpty()
  reservationId: string;
}
