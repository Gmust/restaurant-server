import { IsEnum, IsNotEmpty } from 'class-validator';

import { Roles } from '../../types/user';

export class NotificateUsersDto {
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  subject: string;
}
