import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { Units } from '../types/ingredient';

export type IngredientDocument = Ingredient & Document;

@Schema()
export class Ingredient {
  @Prop({ type: String, required: [true, 'Ingredient string is required'], unique: true })
  @IsNotEmpty({ message: 'Ingredient string is required' })
  name: string;

  @Prop({ type: Number, required: [true, 'Quantity is required'] })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;

  @Prop({ type: String, enum: Object.values(Units), unique: true })
  @IsEnum(Units, { message: 'Invalid unit' })
  unit: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
