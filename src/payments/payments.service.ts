import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import Stripe from 'stripe';

import { CreateGuestOrderDto } from '../orders/dto/create-guest-order.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  private stripe;

  constructor(private ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  private generateConfirmationToken(): string {
    const tokenBytes = randomBytes(32);

    return tokenBytes.toString('hex');
  }

  public async createPaymentSessionForGuest({
    email,
    totalPrice,
    cartItems,
    takeaway,
    promoCode,
    orderDate,
  }: Omit<CreateGuestOrderDto, 'confirmationToken'>) {
    const newOrder = await this.ordersService.createOrderForGuest({
      orderDate,
      promoCode,
      takeaway,
      email,
      cartItems,
      totalPrice,
      confirmationToken: this.generateConfirmationToken(),
    });

    const lineItems = newOrder.orderItems.map((item: any) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.dish.name,
          },
          unit_amount: item.dish.price,
        },
        quantity: item.quantity,
      };
    });
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/order/successful-payment?confirmationToken=${newOrder.confirmationToken}&orderNum=${newOrder.orderNumber}&email=${newOrder.email}`,
        cancel_url: `${process.env.FRONTEND_URL}/order/abandoned-payment?orderId=${newOrder._id}`,
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
