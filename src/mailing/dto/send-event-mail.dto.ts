import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEventMailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template: string;

  @IsNotEmpty()
  eventDescription: string;
}
