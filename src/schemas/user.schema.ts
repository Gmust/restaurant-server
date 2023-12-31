import * as mongoose from 'mongoose';
import { IUser, Roles } from '../types/user';

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

export const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    secondName: {
      type: String,
      required: [true, 'Second name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: {
        validator: value => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
        message: props => `${props.value} is not a valid email!`,
      },
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.user,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
    },
    createdAt: Date,
    updatedAt: Date,
    resetToken: null,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Order',
    },
  },
  schemaOptions
);
