import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { BookingService } from './booking.service';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ChangeReservationDataDto } from './dto/change-reservation-data.dto';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @HttpCode(HttpStatus.OK)
  @Post('new-reservation')
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    try {
      return this.bookingService.createReservation(createReservationDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch('change-reservation')
  async changeReservation(@Body() changeReservationDataDto: ChangeReservationDataDto) {
    try {
      return this.bookingService.changeReservation(changeReservationDataDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete('cancel-reservation')
  async cancelReservation(@Body() cancelReservationDto: CancelReservationDto) {
    try {
      return this.bookingService.cancelReservation(cancelReservationDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm-reservation')
  async confirmReservation(@Body() confirmReservationDro: ConfirmReservationDto) {
    try {
      return this.bookingService.confirmReservation(confirmReservationDro);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('')
  async getAllReservations(@Body() { confirmed }: { confirmed: boolean }) {
    try {
      return this.bookingService.getAllReservation({ confirmed });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  deleteAllUnconfirmedReservations() {
    try {
      return this.bookingService.deleteAllUnconfirmedReservations();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
