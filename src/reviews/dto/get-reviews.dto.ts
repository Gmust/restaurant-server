import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetReviewsDto {
  @ApiProperty({
    example: 10,
    description: 'Limit for reviews per 1 time',
    type: Number,
  })
  @IsNotEmpty()
  limit: number;

  @ApiProperty({
    example: 1,
    description: 'Skip page',
    type: Number,
  })
  @IsNotEmpty()
  skip: number;

  @ApiProperty({
    example: false,
    description: 'Receive new reviews first',
    type: Boolean,
  })
  @IsOptional()
  @IsNotEmpty()
  newFirst: boolean;

  @ApiProperty({
    example: true,
    description: 'Receive old reviews first',
    type: Boolean,
  })
  @IsOptional()
  @IsNotEmpty()
  oldFirst: boolean;
}
