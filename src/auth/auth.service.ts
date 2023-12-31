import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../types/user';
import * as process from 'process';
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

    const access_token = this.generateAccessToken(user);
    const refresh_token = this.generateRefreshToken(user._id);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  async generateAccessToken(user: IUser): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { userId },
      { expiresIn: '7d', secret: process.env.JWT_SECRET }
    );
  }

  async signUp(signUpDto: SignUpDto): Promise<{ message: string } | undefined> {
    const existingUser = this.userService.findOne(signUpDto.email);

    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = this.userService.createUser(signUpDto);

    if (!createdUser) {
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      message: 'User successfully created!',
    };
  }
}
