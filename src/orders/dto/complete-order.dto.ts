import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CompleteOrderDto {
  @IsNotEmpty()
  orderId: ObjectId;
}
