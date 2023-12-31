import { ObjectId } from 'mongoose';

export interface IOrder extends Document {
  status: Statuses;
  dishes: ObjectId[];
  totalPrice: number;
  promoCode: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export enum Statuses {
  completed = 'Completed',
  preparation = 'Preparation',
  pending = 'Pending',
  accepted = 'Accepted',
  declined = 'Declined',
}
