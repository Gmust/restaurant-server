import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetOrderInfoDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The e-mail address from which the order was made',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'ORD1234',
    description: 'Order number from pfd document',
    type: String,
  })
  @IsNotEmpty()
  orderNumber: string;
}
