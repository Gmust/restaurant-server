import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

import { OrderItem } from '../../schemas/orderItem.schema';

export class GenerateOrderDocumentDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Customer Email',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: JSON.stringify({ quantity: 1, dish: 's2ad21312dfe4ew2' }),
    description: 'Order items',
    type: OrderItem,
  })
  @IsNotEmpty()
  orderItems: OrderItem[];

  @ApiProperty({
    example: 400,
    description: 'Total price',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  totalPrice;

  @ApiProperty({
    example: 'ORD1234',
    description: 'Order number',
    type: String,
  })
  @IsNotEmpty()
  orderNumber;
}
