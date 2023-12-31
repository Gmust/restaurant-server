import * as mongoose from 'mongoose';
import { ITable } from '../types/table';

export const TableSchema = new mongoose.Schema<ITable>({
  tableNum: {
    type: Number,
    required: [true, 'Table number is required'],
    unique: true,
  },
  numberOfSeats: {
    type: Number,
    required: [true, 'Number of seats is required'],
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});
