import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('')
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    try {
      return this.reviewsService.createReview(createReviewDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('update-review')
  async updateReview(@Body() updateReviewDto: UpdateReviewDto) {
    try {
      return this.reviewsService.updateReview(updateReviewDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteReview(@Param() params: { id: string }) {
    try {
      return this.reviewsService.deleteReview(params.id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getReviews(@Query() query: GetReviewsDto) {
    try {
      return this.reviewsService.getReviews(query);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
