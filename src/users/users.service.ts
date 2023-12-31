import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IUser } from '../types/user';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<IUser>
  ) {}

  async findOne(email: string): Promise<IUser | null> {
    if (!email) {
      throw new HttpException('Provide email!', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('There is nu such user!', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
