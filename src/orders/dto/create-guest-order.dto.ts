import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { CartItem } from '../../schemas/cartItem.schema';

export class CreateGuestOrderDto {
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

  @ApiProperty({
    example: [
      { quantity: 1, dish: 'dsadsadsww' },
      { quantity: 3, dish: '41412dsadsadsww' },
    ],
    description: 'Cart Items',
    type: String,
  })
  @IsNotEmpty()
  @IsArray()
  cartItems: CartItem[];

  @ApiProperty({
    example: 1000,
    description: 'Total price for all products',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    example: 'dasdasdas32fweefw',
    description: 'Confirmation number for order',
    type: String,
  })
  @IsNotEmpty()
  confirmationToken: string;
}
