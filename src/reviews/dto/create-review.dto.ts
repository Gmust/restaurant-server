import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: '653sda21fs32fs1',
    description: 'Id of user',
    type: String,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 5,
    description: 'Rating',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty({
    example: 'Cool restaurant',
    description: 'Review for restaurant',
    type: String,
  })
  @IsNotEmpty()
  comment: string;
}
