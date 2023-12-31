import * as mongoose from 'mongoose';
import { IReview } from '../types/review';

const schemaOptions = {
  timestamps: { date: 'created_at', updatedAt: 'updated_at' },
};

export const ReviewSchema = new mongoose.Schema<IReview>(
  {
    user: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: [true, 'User is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      minlength: [5, 'Comment must contain at least 5 symbols'],
    },
  },
  schemaOptions
);
