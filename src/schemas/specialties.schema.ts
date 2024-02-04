import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export type SpecialtiesDocument = Specialties & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Specialties {
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Dish' }] })
  @ArrayNotEmpty({ message: 'At least one order item is required ' })
  specialties: mongoose.Types.ObjectId[];
}

export const SpecialtiesSchema = SchemaFactory.createForClass(Specialties);
