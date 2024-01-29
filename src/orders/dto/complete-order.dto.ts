import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CompleteOrderDto {
  @ApiProperty({
    example: 'sd3r12eewq23123rw',
    description: 'Id of order',
    type: String,
  })
  @IsNotEmpty()
  orderId: ObjectId;
}
