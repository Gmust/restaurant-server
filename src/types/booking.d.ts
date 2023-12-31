import { ObjectId } from 'mongoose';

export interface IBooking extends Document {
  timeOfReservation: Date;
  table: ObjectId;
  amountOfVisitors: number;
}
