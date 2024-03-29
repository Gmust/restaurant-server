import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { ChangeRecieveNewsDto } from './dto/change-recieve-news.dto';
import { NotificateUsersDto } from './dto/notificate-users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('change-receive-news')
  async changeReceiveNews(@Body() changeReceiveNewsDto: ChangeRecieveNewsDto) {
    try {
      return this.usersService.changeReceivingNews(changeReceiveNewsDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('send-notification')
  async notificateUsers(@Body() notificateUserDto: NotificateUsersDto) {
    try {
      return this.usersService.notificateUsers(notificateUserDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
