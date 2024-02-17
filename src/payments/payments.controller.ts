import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('pay-for-order')
  async payForOrder(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPaymentSession({ cart: createPaymentDto.cart });
  }
}
