import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { MailingService } from '../mailing/mailing.service';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
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

    if (user.isConfirmed !== true) {
      throw new HttpException(
        'Confirm your account using link in your email before logging in!',
        HttpStatus.UNAUTHORIZED
      );
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

    const confirmationToken = await createdUser.createConfirmationToken();
    const confirmationLink = `${process.env.FRONTEND_URL}confirm-account?token=${confirmationToken}`;

    createdUser.confirmationToken = confirmationToken;
    await createdUser.save();

    await this.mailingService.sentConfirmationEmail({ confirmationLink, email: createdUser.email });

    return {
      message: 'User successfully created! Confirmation link sent to your email!',
    };
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }

  async getUserByToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);
      return decodedToken.user;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed:');
      return null;
    }
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new ForbiddenException('Please provide email');
    }

    const user = await this.userService.findOne(email);
    const resetToken = await user.createPasswordResetToken();
    const resetLink = `${process.env.FRONTEND_URL}reset-password?token=${resetToken}`;

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = new Date().getTime() + 60 * 60 * 1000 * 2;

    await user.save();

    await this.mailingService.sendResetPasswordMail({ resetLink, email });

    return {
      message: 'Reset link has been sent to your email!',
    };
  }

  async resetPassword({ resetToken, newPassword, email }: ResetPasswordDto) {
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

  async confirmAccount({ confirmationToken, email }: ConfirmAccountDto) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new ForbiddenException('Invalid email!');
    }

    if (user.confirmationToken != confirmationToken) {
      throw new UnauthorizedException('Invalid confirmation token');
    }

    if (user.confirmationToken === confirmationToken) {
      user.confirmationToken = '';
      user.isConfirmed = true;
      await user.save();
    }

    return {
      message: 'Account successfully confirmed!',
    };
  }
}
