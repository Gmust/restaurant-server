import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDocumentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  document: Buffer;
}
