import { IsNotEmpty, IsNumber } from 'class-validator';

import { CartItem } from '../../schemas/cartItem.schema';

export class CreatePaymentDto {
  @IsNotEmpty()
  cartItems: CartItem[];

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
