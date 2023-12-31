import * as mongoose from 'mongoose';
import { IDish } from '../types/dish';

export const DishSchema = new mongoose.Schema<IDish>({
  name: {
    type: String,
    required: [true, 'Dish name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  ingredients: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Ingredient',
    required: [true, 'Ingredients is required'],
  },
  preparationTime: {
    type: String,
    required: [true, 'Preparation time is required'],
  },
});
