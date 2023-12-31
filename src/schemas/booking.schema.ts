import * as mongoose from 'mongoose';
import { IBooking } from '../types/booking';

const schemaOptions = {
  timestamps: { timeOfReservation: 'created_at', updatedAt: 'updated_at' },
};

export const BookingSchema = new mongoose.Schema<IBooking>(
  {
    table: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Table',
      required: [true, 'Table is required!'],
      unique: true,
    },
    amountOfVisitors: {
      type: Number,
      required: [true, 'Amount of visitors is required'],
    },
  },
  schemaOptions
);
