import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { Roles } from '../../types/user';

export class NotificateUsersDto {
  @ApiProperty({
    example: Roles.user,
    description: 'Role name from enum',
  })
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  @ApiProperty({
    example: 'Welcome to our restaurant',
    description: 'Notification message',
  })
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: 'Invitation',
    description: 'Email subject',
  })
  @IsNotEmpty()
  subject: string;
}
