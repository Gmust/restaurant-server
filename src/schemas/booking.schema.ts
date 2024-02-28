import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { ReservationTime } from '../types/booking';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Booking {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Table is required!'],
  })
  table: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, required: [true, 'Amount of visitors is required'] })
  amountOfVisitors: number;

  @Prop({ type: String, required: [true, 'Reservation date is required'] })
  timeOfReservation: ReservationTime;

  @Prop({ type: String, required: [true, 'Email is required!'] })
  @IsEmail()
  email: string;

  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
