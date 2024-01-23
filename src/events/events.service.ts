import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MailingService } from '../mailing/mailing.service';
import { Events, EventsDocument } from '../schemas/events.schema';
import { UsersService } from '../users/users.service';
import { validateTime } from '../utils/validateTime';
import { ChangeEventDto } from './dto/change-event.dto';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events.name) private eventsModel: Model<Events>,
    private userService: UsersService,
    private mailingService: MailingService
  ) {}

  async createEvent({ endDate, startDate, name, description }: CreateEventDto) {
    try {
      const usersWithNews = await this.userService.getAllWithNews();

      const newEvent = await this.eventsModel.create({
        description,
        name,
        endDate,
        startDate,
      });

      if (!newEvent) {
        throw new InternalServerErrorException('Something went wrong');
      }
      validateTime({ date: startDate, message: 'Event can`t be created in the past' });
      for (const user of usersWithNews) {
        try {
          await this.mailingService.sendEventMail({
            subject: `New event ${name}`,
            eventDescription: description,
            email: user.email,
            template: 'event-template',
          });
          console.log(`Email sent successfully to ${user.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${user.email}: ${error.message}`);
        }
      }
      return {
        message: 'New event successfully created!',
        newEvent,
      };
    } catch (e) {
      if (e.code === 11000)
        throw new ConflictException('An event with the same name already exists.');
    }
  }

  async changeEventInfo({ description, name, endDate, startDate, eventId }: ChangeEventDto) {
    const event = await this.findEvent(eventId);

    validateTime({ date: startDate, message: 'Can`t change start date to passed time' });

    if (description) {
      event.description = description;
    }
    if (name) {
      event.name = name;
    }
    if (endDate) {
      event.endDate = endDate;
    }
    if (startDate) {
      event.startDate = startDate;
    }
    await event.save();

    return {
      message: 'Event successfully updated',
      event,
    };
  }

  async findEvent(eventId: string): Promise<EventsDocument | null> {
    const event = await this.eventsModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('Invalid id!');
    }
    return event;
  }

  async deleteEvent(eventId: string) {
    await this.eventsModel.findByIdAndDelete(eventId);
    return {
      message: 'Event has been successfully deleted!',
    };
  }

  async deleteAllPassedEvent() {
    const today = new Date();
    today.setHours(today.getHours() + 1);
    await this.eventsModel.deleteMany({ endDate: { $lt: today } });
  }

  async getAllEvents() {
    return this.eventsModel.find();
  }
}
