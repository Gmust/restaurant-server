import { ObjectId } from 'mongoose';

export interface IReview extends Document {
  user: ObjectId;
  rating: number;
  comment: string;
  date: Date;
}
