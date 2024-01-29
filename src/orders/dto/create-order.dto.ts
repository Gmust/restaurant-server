import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: '2024-01-29T17:33:46.328Z',
    description: 'Time when item was ordered',
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  orderDate: Date;

  @ApiProperty({
    example: 'sd3r12e',
    description: 'Promo code string',
    type: String,
  })
  @IsOptional()
  promoCode?: string;

  @ApiProperty({
    example: false,
    description: 'If ordering on-site or to-go',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  takeaway: boolean;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Email of customer',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
