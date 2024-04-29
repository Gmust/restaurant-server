import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Review {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    unique: [true, 'User can have only 1 review'],
  })
  user: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Number, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, minlength: [2, 'Comment must contain at least 2 symbols'] })
  reviewComment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
