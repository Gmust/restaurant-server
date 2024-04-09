import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { CompleteOrderDto } from './dto/complete-order.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeleteOrderDto } from './dto/delete-order.dto';
import { GetOrderInfoDto } from './dto/get-order-info.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    private orderService: OrdersService,
    private ordersGateway: OrdersGateway
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('create-new-order')
  async createNewOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      return this.orderService.createOrder(createOrderDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('create-new-guest-order')
  async createNewGuestOrder(@Body() createNewGuestOrder: CreateGuestOrderDto) {
    try {
      return this.orderService.createOrderForGuest(createNewGuestOrder);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('get-order-info')
  async getOrderInfo(@Body() { orderNumber, email }: GetOrderInfoDto) {
    try {
      return this.orderService.getOrderInfo({ orderNumber, email });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('get-order/:id')
  async getOrderInfoById(@Param('id') id: string) {
    try {
      return this.orderService.getOrderById(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm-order')
  async confirmOrder(@Body() confirmOrderDto: ConfirmOrderDto) {
    try {
      return this.orderService.confirmOrder(confirmOrderDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator, Roles.cook)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('delete-order')
  async deleteOrder(@Body() confirmOrderReceived: DeleteOrderDto) {
    try {
      return this.orderService.deleteOrder(confirmOrderReceived);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator, Roles.cook)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('update-order-status')
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const updateOrderStatus = await this.orderService.updateOrderStatus(updateOrderStatusDto);
      if (!updateOrderStatusDto) {
        throw new BadRequestException('Something went wrong!');
      }
      console.log(updateOrderStatus);
      this.ordersGateway.handleStatus({
        orderId: updateOrderStatus.orderId,
        newStatus: updateOrderStatusDto.newStatus,
        userId: updateOrderStatusDto.userId,
      });
      return {
        message: 'Order status successfully updated',
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator, Roles.cook)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('complete-order')
  async completeOrder(@Body() completeOrderDro: CompleteOrderDto) {
    try {
      return this.orderService.completeOrder(completeOrderDro);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('')
  async getUserOrders(@Query('userId') userId: string) {
    try {
      return this.orderService.getUserOrders(userId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator, Roles.cook)
  @UseGuards(RoleGuard)
  @Get('orders-list')
  async getAllOrders() {
    try {
      return this.orderService.getAllOrders();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  deleteAllUnconfirmedOrders() {
    try {
      return this.orderService.deleteAllUnconfirmedOrders();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  deleteAllCompletedOrders() {
    try {
      return this.orderService.deleteAllCompletedOrders();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
