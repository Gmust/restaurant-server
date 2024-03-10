import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateGuestOrderDto } from '../orders/dto/create-guest-order.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('guest-pay-for-order')
  async guestPayForOrder(@Body() createPaymentDto: Omit<CreateGuestOrderDto, 'confirmationToken'>) {
    try {
      return this.paymentsService.createPaymentSessionForGuest(createPaymentDto);
    } catch (e) {
      throw new Error(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('user-pay-for-order')
  async userPayForOrder(@Body() createPaymentDto: Omit<CreateOrderDto, 'confirmationToken'>) {
    try {
      return this.paymentsService.createPaymentSessionForUser(createPaymentDto);
    } catch (e) {
      throw new Error(e);
    }
  }
}
