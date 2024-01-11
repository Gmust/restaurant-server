import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { Cart, CartSchema } from '../schemas/cart.schema';
import { CartItem, CartItemSchema } from '../schemas/cartItem.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    AuthModule,
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
