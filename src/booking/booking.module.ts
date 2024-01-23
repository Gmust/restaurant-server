import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { MailingModule } from '../mailing/mailing.module';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { TablesModule } from '../tables/tables.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: BookingSchema, name: Booking.name }]),
    AuthModule,
    TablesModule,
    MailingModule,
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
