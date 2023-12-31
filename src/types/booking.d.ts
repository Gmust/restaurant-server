import { ObjectId } from 'mongoose';

export interface IBooking {
  timeOfReservation: Date;
  table: ObjectId;
  amountOfVisitors: number;
}
