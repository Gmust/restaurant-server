import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ChangeRecieveNewsDto {
  @ApiProperty({
    example: '65a560c2ed6b563a2d80477bd3a2123',
    description: 'Id of user',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Flag if user want to receive news',
  })
  @IsNotEmpty()
  @IsBoolean()
  receiveNews: boolean;
}
