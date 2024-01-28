import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    example: 'Cool restaurant',
    description: 'Enter description',
    type: String,
  })
  @IsOptional()
  @IsString()
  newComment: string;

  @ApiProperty({
    example: 5,
    description: 'New rate',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  newRating;

  @ApiProperty({
    example: '65a56ed6b563a2d80477bf3f4f3f3f3',
    description: 'Review id',
    type: String,
  })
  @IsNotEmpty()
  reviewId: string;
}
