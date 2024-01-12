import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromoCodeDocument = PromoCode & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class PromoCode {
  @Prop({ type: String, required: [true, 'Promo code is required'], unique: true })
  promoCode: string;

  @Prop({ type: Date, required: [true, 'Set expiration date of promo code'] })
  expiresIn: Date;

  @Prop({ type: Number, required: [true, 'Discount value is required'] })
  discountValue: number;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
