import { IsNotEmpty } from 'class-validator';

export class ConfirmOrderReceivedDto {
  @IsNotEmpty()
  orderId: string;
}
