import { ObjectId } from 'mongoose';

export interface IDish extends Document {
  name: string;
  price: number;
  preparationTime: string;
  ingredients: ObjectId[];
  isVegan: boolean;
  description: string;
}
