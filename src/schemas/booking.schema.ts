import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayNotEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Booking {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    required: [true, 'Table is required!'],
    unique: true,
  })
  @ArrayNotEmpty({ message: 'At least one table is required for the booking' })
  table: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Number, required: [true, 'Amount of visitors is required'] })
  @IsNotEmpty({ message: 'Amount of visitors is required' })
  @IsNumber({}, { message: 'Amount of visitors must be a number' })
  amountOfVisitors: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
