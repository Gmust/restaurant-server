import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePromoDto {
  @IsNotEmpty()
  promoCode: string;

  @IsNotEmpty()
  @IsDateString()
  expiresIn: Date;

  @IsNotEmpty()
  @IsNumber()
  discountValue: number;
}
