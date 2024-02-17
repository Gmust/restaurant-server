import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';

import { CartItem } from '../schemas/cartItem.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  public async createPaymentSession({ cart }: CreatePaymentDto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const lineItems = cart.cartItems.map((item: CartItem) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            name: item.dish.name,
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          unit_amount: item.dish.price,
        },
        quantity: item.quantity,
      };
    });

    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/successful-payment`,
        cancel_url: `${process.env.FRONTEND_URL}/abandoned-payment`,
      });

      return {
        sessionId: session.id,
      };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e);
    }
  }
}
