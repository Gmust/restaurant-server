import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  newComment: string;

  @IsOptional()
  @IsNumber()
  newRating;

  @IsNotEmpty()
  reviewId: string;
}
