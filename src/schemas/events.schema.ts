import * as mongoose from 'mongoose';
import { IEvents } from '../types/events';

const schemaOptions = {
  timestamps: { date: 'created_at', updatedAt: 'updated_at' },
};

export const EventsSchema = new mongoose.Schema<IEvents>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
  },
  schemaOptions
);
