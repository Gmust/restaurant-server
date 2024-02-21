import { BadRequestException, Controller, Headers, Post, Req } from '@nestjs/common';

import { RequestWithRawBody } from '../types/middleware';
import { StripeService } from './stripe.service';

@Controller('webhook')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const event = await this.stripeService.constructEventFromPayload(signature, request.rawBody);
  }
}
