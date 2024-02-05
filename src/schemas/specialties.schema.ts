import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type SpecialtiesDocument = Specialties & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Specialties {
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: [true, 'At least 1 specialty dish is required'],
      },
    ],
  })
  specialtyDishes: mongoose.Schema.Types.ObjectId[];
}

export const SpecialtiesSchema = SchemaFactory.createForClass(Specialties);
