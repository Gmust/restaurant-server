import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { ChangeEventDto } from './dto/change-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('')
  async createEvent(@Body() createEventDto: CreateEventDto) {
    try {
      return this.eventsService.createEvent(createEventDto);
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('change-info')
  async changeEvent(@Body() changeEventDto: ChangeEventDto) {
    try {
      return this.eventsService.changeEventInfo(changeEventDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  async deleteEvent(@Param() params: { id: string }) {
    try {
      return this.eventsService.deleteEvent(params.id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getEvent(@Param() params: { id: string }) {
    try {
      return this.eventsService.findEvent(params.id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllEvent() {
    try {
      return this.eventsService.getAllEvents();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  deleteAllUnconfirmedReservations() {
    try {
      return this.eventsService.deleteAllPassedEvent();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
