import { IsNotEmpty } from 'class-validator';

import { Cart } from '../../schemas/cart.schema';

export class CreatePaymentDto {
  @IsNotEmpty()
  cart: Cart;
}
