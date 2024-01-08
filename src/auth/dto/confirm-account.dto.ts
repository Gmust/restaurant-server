import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfirmAccountDto {
  @IsNotEmpty()
  confirmationToken: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
