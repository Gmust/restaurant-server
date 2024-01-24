import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetReviewsDto {
  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  skip: number;

  @IsOptional()
  @IsNotEmpty()
  newFirst: boolean;

  @IsOptional()
  @IsNotEmpty()
  oldFirst: boolean;
}
