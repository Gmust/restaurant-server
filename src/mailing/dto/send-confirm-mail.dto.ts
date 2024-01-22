import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendConfirmMailDto {
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
