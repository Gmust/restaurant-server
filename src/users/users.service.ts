import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<User | null> {
    if (!email) {
      throw new HttpException('Provide email!', HttpStatus.BAD_REQUEST);
    }

    return this.userModel.findOne({ email });
  }

  async createUser(userDto: SignUpDto): Promise<UserDocument> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }
}
