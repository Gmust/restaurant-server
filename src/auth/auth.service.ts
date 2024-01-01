import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
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
}
