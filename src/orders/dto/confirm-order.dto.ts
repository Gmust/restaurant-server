import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfirmOrderDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  orderNumber: string;

  @IsNotEmpty()
  confirmationToken: string;
}
