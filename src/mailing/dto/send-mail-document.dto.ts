import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMailDocumentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  document: Buffer;

  @IsNotEmpty()
  subject: string;

  @IsOptional()
  template: string;
}
