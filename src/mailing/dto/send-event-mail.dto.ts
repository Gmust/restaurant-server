import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEventMailDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Event',
    description: 'Subject of mail',
    type: String,
  })
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'event-template',
    description: 'Template',
    type: String,
  })
  @IsNotEmpty()
  template: string;

  @ApiProperty({
    example: 'Cool new event',
    description: 'Event description',
    type: String,
  })
  @IsNotEmpty()
  eventDescription: string;
}
