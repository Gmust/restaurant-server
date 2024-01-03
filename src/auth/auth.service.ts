import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

import { MailingService } from '../mailing/mailing.service';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailingService: MailingService
  ) {}

  async signIn({ password, email }: SignInDto): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const access_token = await this.generateAccessToken(user);
    const refresh_token = await this.generateRefreshToken(String(user._id));

    return {
      user: {
        _id: user._id,
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        role: user.role,
        cart: user.cart,
        orders: user.orders,
      },
      access_token,
      refresh_token,
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { userId },
      { expiresIn: '7d', secret: process.env.JWT_SECRET }
    );
  }

  async signUp(signUpDto: SignUpDto): Promise<{ message: string } | undefined> {
    const existingUser = await this.userService.findOne(signUpDto.email);

    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = await this.userService.createUser(signUpDto);

    if (!createdUser) {
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      message: 'User successfully created!',
    };
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new ForbiddenException('Please provide email');
    }

    const user = await this.userService.findOne(email);
    const resetToken = await user.createPasswordResetToken();
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = new Date().getTime() + 60 * 60 * 1000 * 2;

    await user.save();

    await this.mailingService.sendResetPasswordMail({ resetLink, email });

    return {
      message: 'Reset link has been sent to your email!',
    };
  }

  async resetPassword({ resetToken, newPassword, email }: ResetPasswordDto) {
    console.log(resetToken);
    console.log(newPassword);
    console.log(email);

    const user = await this.userService.findOne(email);

    if (!user) {
      throw new ForbiddenException('Invalid email');
    }

    if (!resetToken || !user.resetPasswordToken) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ForbiddenException('Token is invalid!');
    }

    if (user.resetPasswordExpires < new Date().getTime()) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ForbiddenException('Token has expired!');
    }

    if (resetToken == user.resetPasswordToken) {
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return {
        message: 'Password reset successfully!',
      };
    }
  }
}
