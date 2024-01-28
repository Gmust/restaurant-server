import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePromoDto {
  @ApiProperty({
    example: 'ds021',
    description: 'Promo code',
    type: String,
  })
  @IsNotEmpty()
  promoCode: string;

  @ApiProperty({
    example: '2024-01-28T19:04:18.935Z',
    description: 'Date of promo expires in',
    type: String,
  })
  @IsNotEmpty()
  @IsDateString()
  expiresIn: Date;

  @ApiProperty({
    example: 50,
    description: 'Amount of promo discount',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  discountValue: number;
}
