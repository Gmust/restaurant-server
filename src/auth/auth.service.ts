import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CartService } from '../cart/cart.service';
import { MailingService } from '../mailing/mailing.service';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailingService: MailingService,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService
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
        receiveNews: user.receiveNews,
      },
      access_token,
      refresh_token,
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { user },
      { expiresIn: '15m', secret: process.env.JWT_SECRET }
    );
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
    const newCart = await this.cartService.createCart();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    createdUser.cart = newCart._id;

    const confirmationToken = await createdUser.createConfirmationToken();
    const confirmationLink = `${process.env.FRONTEND_URL}/confirm-account?token=${confirmationToken}&email=${createdUser.email}`;

    createdUser.confirmationToken = confirmationToken;
    await createdUser.save();

    await this.mailingService.sendConfirmationMail({
      link: confirmationLink,
      email: createdUser.email,
      subject: 'Account confirmation',
      template: 'account-confirmation-template',
    });

    return {
      message: 'User successfully created! Confirmation link sent to your email!',
    };
  }

  async validateToken(token: string) {
    try {
      if (!token) {
        throw new UnauthorizedException('Provide token!');
      }
      return this.jwtService.verify(token, {});
    } catch (e) {
      console.log(e);
    }
  }

  async getUserByToken(token: string) {
    const parsedTokenData = await this.parseJwt(token);
    const user = await this.userService.findOne(parsedTokenData.user.email);
    return user;
  }

  async refreshToken({ refresh_token, email }: RefreshTokenDto) {
    const validToken = await this.validateToken(refresh_token);
    const user = await this.userService.findOne(email);
    const access = await this.generateAccessToken(user);
    if (validToken.error) {
      if (validToken.error === 'jwt expired') {
        const refresh = this.generateRefreshToken(user._id as unknown as string);
        return { access_token: access, ...refresh };
      } else {
        return { error: validToken.error };
      }
    } else {
      return { access_token: access, refresh_token: refresh_token };
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

  async parseJwt(token) {
    const t = String(token);
    return JSON.parse(Buffer.from(t.split('.')[1], 'base64').toString());
  }

  async getUserByTokenData(token: string) {
    const parsedTokenData = await this.parseJwt(token);
    return this.userService.findOne(parsedTokenData.user.email);
  }
}
