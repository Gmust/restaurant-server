import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllWithNews() {
    return this.userModel.find({ receiveNews: true });
  }

  async findOne(email: string): Promise<UserDocument | null> {
    if (!email) {
      throw new HttpException('Provide email!', HttpStatus.BAD_REQUEST);
    }

    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!id) {
      throw new HttpException('Provide email!', HttpStatus.BAD_REQUEST);
    }
    return this.userModel.findById(id);
  }

  async createUser(userDto: SignUpDto): Promise<UserDocument> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }

  async changeReceivingNews({ userId, receiveNews }: { userId: string; receiveNews: boolean }) {
    const user = await this.userModel.findById(userId);
    if (user.receiveNews === receiveNews) {
      throw new BadRequestException('User already doing it');
    }

    user.receiveNews = receiveNews;
    user.save({ validateBeforeSave: false });
    return user;
  }
}
