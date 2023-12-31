import { ObjectId } from 'mongoose';

export interface ICart {
  dishes: ObjectId[];
  totalPrice: Promise<number>;
}
