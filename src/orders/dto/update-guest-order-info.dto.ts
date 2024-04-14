import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { Statuses } from '../../types/order';

export class UpdateGuestOrderStatusDto {
  @ApiProperty({
    example: '65a560c2ds4ab563a2d80477b',
    description: 'Id of order',
    type: String,
  })
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    example: Statuses.accepted,
    description: 'New status',
    type: String,
  })
  @IsNotEmpty()
  @IsEnum(Statuses)
  newStatus: Statuses;
}
