import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SignUpDto } from '../auth/dto/sign-up.dto';
import { MailingService } from '../mailing/mailing.service';
import { User, UserDocument } from '../schemas/user.schema';
import { NotificateUsersDto } from './dto/notificate-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailingService: MailingService
  ) {}

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

  async notificateUsers({ message, subject, role }: NotificateUsersDto) {
    const usersWithRole = await this.userModel.find({ role });

    for (const user of usersWithRole) {
      try {
        await this.mailingService.sendNotification({
          email: user.email,
          subject,
          message,
          template: 'notification-template',
        });
        console.log(`Email sent successfully to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}: ${error.message}`);
      }
    }

    return {
      message: `Notification has been successfully to ${role}'s`,
    };
  }
}
