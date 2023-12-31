import { ObjectId } from 'mongoose';

export interface IReview {
  user: ObjectId;
  rating: number;
  comment: string;
  date: Date;
}
