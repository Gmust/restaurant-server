import { ObjectId } from 'mongoose';

export interface ICart extends Document {
  dishes: ObjectId[];
  totalPrice: Promise<number>;
}
