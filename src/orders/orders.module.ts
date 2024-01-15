import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { MailingModule } from '../mailing/mailing.module';
import { PromoCodeModule } from '../promo-code/promo-code.module';
import { Order, OrderSchema } from '../schemas/order.schema';
import { OrderItem, OrderItemSchema } from '../schemas/orderItem.schema';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: OrderSchema, name: Order.name },
      { schema: OrderItemSchema, name: OrderItem.name },
    ]),
    PromoCodeModule,
    AuthModule,
    UsersModule,
    MailingModule,
    CartModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
