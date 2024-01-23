import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { MailingModule } from '../mailing/mailing.module';
import { Events, EventsSchema } from '../schemas/events.schema';
import { UsersModule } from '../users/users.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    UsersModule,
    MailingModule,
    AuthModule,
    MongooseModule.forFeature([{ schema: EventsSchema, name: Events.name }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
