import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { MailingService } from '../mailing/mailing.service';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { TablesService } from '../tables/tables.service';
import { bufferPdf } from '../utils/bufferPdf';
import { fonts } from '../utils/fonts';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ChangeReservationDataDto } from './dto/change-reservation-data.dto';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { FindReservationDto } from './dto/find-reservation.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private tablesService: TablesService,
    private mailingService: MailingService
  ) {}

  public async createReservation({
    timeOfReservation,
    table,
    amountOfVisitors,
    email,
  }: CreateReservationDto) {
    if (new Date(timeOfReservation).getTime() < new Date().getTime()) {
      throw new BadRequestException('Table cannot be reserved for a past date');
    }

    const tableDb = await this.tablesService.getTableByNum(table);

    const existingReservation = await this.bookingModel.find({
      table: tableDb,
      timeOfReservation: timeOfReservation,
    });

    console.log(existingReservation);

    if (existingReservation.length > 0) {
      throw new BadRequestException('Table already booked for this time slot');
    }

    if (tableDb.numberOfSeats < amountOfVisitors) {
      throw new BadRequestException(
        'Amount of visitors can`t be bigger than amount of available number of seats'
      );
    }

    const newBooking = await this.bookingModel.create({
      timeOfReservation,
      table: tableDb,
      amountOfVisitors,
      email,
    });

    const link = `${process.env.FRONTEND_URL}/confirm-reservation?t=${tableDb.tableNum}&email=${email}`;

    await this.mailingService.sendConfirmationMail({
      link: link,
      email: email,
      subject: 'Reservation confirmation',
      template: 'reservation-confirmation-template',
    });

    tableDb.isAvailable = false;
    await tableDb.save();

    return {
      message: 'The booking document has been sent to your email!',
      newBooking,
    };
  }

  private async generateBookingDocument({
    timeOfReservation,
    table,
    amountOfVisitors,
    email,
  }: CreateReservationDto) {
    const printer = new PdfPrinter(fonts);
    const content = [
      { text: 'Booking Confirmation:', style: 'header' },
      '\n',
      { text: `Email: ${email}`, style: 'subheader' },
      { text: `Time of Reservation: ${timeOfReservation}`, style: 'subheader' },
      { text: `Table: ${table}`, style: 'subheader' },
      { text: `Number of Visitors: ${amountOfVisitors}`, style: 'subheader' },
    ];

    const docDefinition = {
      content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 5],
        },
      },
    } as TDocumentDefinitions;

    const pdfDocument = printer.createPdfKitDocument(docDefinition);
    return bufferPdf(pdfDocument);
  }

  private async findReservation({
    table,
    email,
  }: FindReservationDto): Promise<BookingDocument | null> {
    const tableDb = await this.tablesService.getTableByNum(table);
    const reservation = await this.bookingModel.findOne({ table: tableDb, email });

    if (!reservation) {
      throw new NotFoundException(
        'No reservation found for the table number and email address provided! Perhaps the time for this confirmation has expired!'
      );
    } else {
      return reservation;
    }
  }

  public async confirmReservation({ confirmed, email, table }: ConfirmReservationDto) {
    const reservation = await this.findReservation({ table, email });

    const tableDb = await this.tablesService.getTableByNum(table);
    if (confirmed === false) {
      await this.cancelReservation({ table, email });
      tableDb.isAvailable = true;
      await tableDb.save();
      return {
        message: 'Confirmation denied',
      };
    } else if (confirmed === true) {
      reservation.isConfirmed = confirmed;
      await reservation.save();
      const bookingDocument = await this.generateBookingDocument({
        timeOfReservation: reservation.timeOfReservation,
        email: reservation.email,
        amountOfVisitors: reservation.amountOfVisitors,
        table: tableDb.tableNum,
      });
      await this.mailingService.sendMailWithAttachment({
        email: reservation.email,
        template: 'test-template',
        subject: 'Booking',
        document: bookingDocument,
      });

      return {
        message:
          'Your reservation has been confirmed and the document has been sent to your email!',
      };
    }
  }

  public async changeReservation({
    timeOfReservation,
    table,
    amountOfVisitors,
    email,
    newTable,
  }: ChangeReservationDataDto) {
    const reservation = await this.findReservation({ email, table });

    if (timeOfReservation) {
      reservation.timeOfReservation = timeOfReservation;
    }
    if (amountOfVisitors) {
      reservation.amountOfVisitors = amountOfVisitors;
    }
    if (newTable) {
      const tableDb = await this.tablesService.getTableByNum(newTable);
      if (tableDb.numberOfSeats < amountOfVisitors) {
        throw new BadRequestException(
          'Amount of visitors can`t be bigger than amount of available number of seats'
        );
      }
      reservation.table = tableDb.id;
    }

    await reservation.save();

    return {
      message: 'Reservation data successfully changed',
      reservation,
    };
  }

  public async cancelReservation({ table, email }: CancelReservationDto) {
    const reservation = await this.findReservation({ table, email });

    await this.bookingModel.deleteOne({ table: reservation.table });

    return {
      message: 'Reservation successfully canceled',
    };
  }

  public async getAllReservation({ confirmed = true }: { confirmed: boolean }) {
    return this.bookingModel.find({ isConfirmed: confirmed });
  }

  public async deleteAllReservationsForDay() {
    return this.bookingModel.deleteMany();
  }

  public async deleteAllUnconfirmedReservations() {
    return this.bookingModel.deleteMany({ isConfirmed: false });
  }

  public async getFullTableReservations(tableId: string): Promise<Booking[] | []> {
    const reservations = await this.bookingModel.find({ table: tableId });
    if (!reservations) {
      return [];
    } else {
      return reservations;
    }
  }
}
