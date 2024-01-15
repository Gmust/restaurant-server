import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsDateString()
  orderDate: Date;

  @IsOptional()
  promoCode?: string;

  @IsNotEmpty()
  @IsBoolean()
  takeaway: boolean;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
