import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

export type EventsDocument = Events & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Events {
  @Prop({ type: String, required: [true, 'Name is required'], unique: true })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Prop({ type: String, required: [true, 'Description is required'] })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}

export const EventsSchema = SchemaFactory.createForClass(Events);
