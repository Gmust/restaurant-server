import { IsEnum, IsNotEmpty } from 'class-validator';

import { Roles } from '../../types/user';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  newStatus: Roles;
}
