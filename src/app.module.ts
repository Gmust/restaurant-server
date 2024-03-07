import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CartModule } from './cart/cart.module';
import { MongooseConfigService } from './config/mongooseConfigService';
import { DishesModule } from './dishes/dishes.module';
import { EventsModule } from './events/events.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { MailingModule } from './mailing/mailing.module';
import { OrdersGateway } from './orders/orders.gateway';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StripeModule } from './stripe/stripe.module';
import { TablesModule } from './tables/tables.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    AuthModule,
    UsersModule,
    MailingModule,
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ScheduleModule.forRoot(),
    IngredientsModule,
    DishesModule,
    CartModule,
    PromoCodeModule,
    OrdersModule,
    TablesModule,
    BookingModule,
    EventsModule,
    ReviewsModule,
    PaymentsModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService, OrdersGateway],
})
export class AppModule {}
