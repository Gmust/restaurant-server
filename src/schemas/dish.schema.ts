import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { DishCategories } from '../types/dish';

export type DishDocument = Dish & Document;

@Schema()
export class Dish {
  @Prop({ type: String, required: [true, 'Dish name is required'], unique: true })
  @IsNotEmpty({ message: 'Dish name is required' })
  name: string;

  @Prop({ type: String, required: [true, 'Description is required'] })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @Prop({ type: Boolean, default: false })
  @IsBoolean({ message: 'isVegan must be a boolean' })
  isVegan: boolean;

  @Prop({ type: Number, required: [true, 'Price is required'] })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }] })
  @ArrayNotEmpty({ message: 'At least one ingredient is required' })
  @IsArray({ message: 'Ingredients must be an array' })
  ingredients: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: String, required: [true, 'Preparation time is required'] })
  @IsNotEmpty({ message: 'Preparation time is required' })
  @IsString({ message: 'Preparation time must be a string' })
  preparationTime: string;

  @Prop({ enum: DishCategories, required: [true, 'Provide dish category'] })
  @IsEnum(DishCategories)
  category: string;

  @Prop({ type: Boolean, default: true })
  @IsBoolean({ message: 'Is available should be a boolean type' })
  isAvailable: boolean;

  @Prop({ type: String, required: [true, 'Dish image is required'] })
  image: string;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
