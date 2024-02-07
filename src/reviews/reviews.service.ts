import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Review } from '../schemas/review.schema';
import { UsersService } from '../users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private userService: UsersService
  ) {}

  public async createReview({ userId, rating, comment }: CreateReviewDto) {
    try {
      const user = await this.userService.findById(userId);
      const newReview = await this.reviewModel.create({ rating, reviewComment: comment, user });
      user.review = newReview.id;
      await user.save({ validateBeforeSave: false });

      return {
        newReview,
        message: 'New review successfully posted',
      };
    } catch (e) {
      if (e.code === 11000) throw new ConflictException('User can have only one review');
    }
  }

  public async deleteReview(reviewId: string) {
    if (!reviewId) {
      throw new BadRequestException('Provide review id ');
    }

    await this.reviewModel.findByIdAndDelete(reviewId);

    return {
      message: 'Review successfully deleted',
    };
  }

  public async updateReview({ newRating, newComment, reviewId }: UpdateReviewDto) {
    const review = await this.reviewModel.findById(reviewId);

    if (newRating) {
      review.rating = newRating;
    }
    if (newComment) {
      review.reviewComment = newComment;
    }

    await review.save();

    return {
      updatedReview: review,
    };
  }

  public async getReviews({
    newFirst = true,
    oldFirst = false,
    limit = 10,
    skip = 0,
  }: GetReviewsDto) {
    const reviewsCount = await this.reviewModel.countDocuments();
    const pageTotal = Math.floor((reviewsCount - 1) / limit) + 1;

    let data;

    if (newFirst) {
      data = await this.reviewModel
        .find({})
        .sort({ created_at: 1 })
        .populate('user')
        .limit(limit)
        .skip(skip);
    }

    if (oldFirst) {
      data = await this.reviewModel
        .find({})
        .sort({ created_at: -1 })
        .populate('user')
        .limit(limit)
        .skip(skip);
    }

    return {
      data,
      pageTotal,
    };
  }
}
