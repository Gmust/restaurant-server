import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  resetLink: string;
}
