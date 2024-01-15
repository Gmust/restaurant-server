import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

import { OrderItem } from '../../schemas/orderItem.schema';

export class GenerateOrderDocumentDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  orderItems: OrderItem[];

  @IsNotEmpty()
  @IsNumber()
  totalPrice;
}
