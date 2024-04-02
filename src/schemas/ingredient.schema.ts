import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Units } from '../types/ingredient';

export type IngredientDocument = Ingredient & Document;

@Schema()
export class Ingredient {
  @Prop({ type: String, required: [true, 'Ingredient name is required'] })
  name: string;

  @Prop({ type: Number, required: [true, 'Quantity is required'] })
  quantity: number;

  @Prop({ type: String, required: [true, 'Unit is required'], enum: Object.values(Units) })
  unit: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
