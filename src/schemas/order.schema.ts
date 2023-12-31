import * as mongoose from 'mongoose';
import { IOrder, Statuses } from '../types/order';

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

export const OrderSchema = new mongoose.Schema<IOrder>(
  {
    status: {
      type: String,
      enum: Object.values(Statuses),
      default: Statuses.pending,
    },
    dishes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Dish',
      validate: {
        validator: value => value && value.length > 0,
        message: 'At least one dish is required',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
    promoCode: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  schemaOptions
);
