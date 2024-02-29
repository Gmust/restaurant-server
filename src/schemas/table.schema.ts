import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TableDocument = Table & Document;

@Schema()
export class Table {
  @Prop({ type: Number, required: [true, 'Table number is required'], unique: false })
  tableNum: number;

  @Prop({ type: Number, required: [true, 'Number of seats is required'] })
  numberOfSeats: number;
}

export const TableSchema = SchemaFactory.createForClass(Table);
