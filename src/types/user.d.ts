import { ObjectId } from 'mongoose';

export interface IUser {
  firstName: string;
  secondName: string;
  password: string;
  resetToken: string | null;
  email: string;
  role: Roles;
  orders: ObjectId[];
  cart: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export enum Roles {
  user = 'User',
  administrator = 'Administrator',
  cook = 'Cook',
}
