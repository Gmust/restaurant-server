import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventsDocument = Events & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Events {
  @Prop({
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Event name should be unique'],
  })
  name: string;

  @Prop({ type: String, required: [true, 'Description is required'] })
  description: string;

  @Prop({ types: Date, required: [true, 'Date start is required'] })
  startDate: Date;

  @Prop({ types: Date, required: [true, 'Date end  is required'] })
  endDate: Date;
}

export const EventsSchema = SchemaFactory.createForClass(Events);
