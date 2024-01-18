import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { CompleteOrderDto } from './dto/complete-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';

@Controller('orders')
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
  @Role(Roles.administrator, Roles.cook)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('update-order-status')
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const { orderId, newStatus, userId } =
        await this.orderService.updateOrderStatus(updateOrderStatusDto);
      this.ordersGateway.handleStatus({ orderId, newStatus, userId });
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
}
