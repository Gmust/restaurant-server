import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create-new-order')
  async createNewOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // @HttpCode(HttpStatus.OK)
  // @Get('')
  // async downloadPDF(@Res() response: Response) {
  //   const pdfDoc = await this.orderService.puppeteerTest();
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-expect-error
  //   pdfDoc.pipe(response);
  //   pdfDoc.end();
  // }
}
