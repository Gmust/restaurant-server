import * as mongoose from 'mongoose';
import { IIngredient, Units } from '../types/ingredient';

export const IngredientSchema = new mongoose.Schema<IIngredient>({
  name: {
    type: String,
    required: [true, 'Ingredient string is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
  },
  unit: {
    type: String,
    enum: Object.values(Units),
  },
});
