import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  resetToken: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  newPassword: string;
}
