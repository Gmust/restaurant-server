import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

import { Roles } from '../types/user';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @Prop()
  @IsNotEmpty({ message: 'Second name is required' })
  secondName: string;

  @Prop()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Prop({ enum: Roles, default: Roles.user })
  @IsEnum(Roles)
  role: string;

  @Prop()
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;

  @Prop({ default: '' })
  confirmationToken: string;

  @Prop({
    type: String,
  })
  resetPasswordToken;

  @Prop({
    type: Date,
  })
  resetPasswordExpires;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  cart: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] })
  orders: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  @IsBoolean({ message: 'Is confirmed should be boolean type' })
  isConfirmed;

  createPasswordResetToken: () => Promise<string>;

  createConfirmationToken: () => Promise<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.createPasswordResetToken = async function () {
  const generateResetToken = async () => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('resetToken', salt);
      const encodedToken = encodeURIComponent(hash);
      return encodedToken;
    } catch (err) {
      throw err;
    }
  };

  const resetToken = await generateResetToken();
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = new Date().getTime() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.methods.createConfirmationToken = async function () {
  const generateConfirmationToken = async () => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('confirmToken', salt);
      const encodedToken = encodeURIComponent(hash);
      return encodedToken;
    } catch (err) {
      throw err;
    }
  };

  const confirmationToken = await generateConfirmationToken();
  this.confirmationToken = confirmationToken;

  return confirmationToken;
};
