import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import Stripe from 'stripe';

import { CreateGuestOrderDto } from '../orders/dto/create-guest-order.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { OrdersService } from '../orders/orders.service';
import { GuestOrderDocument } from '../schemas/guestOrder.schema';
import { OrderDocument } from '../schemas/order.schema';

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

  private createLineItems(newOrder: GuestOrderDocument | OrderDocument) {
    return newOrder.orderItems.map((item: any) => {
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
  }

  private async createStripeSession({
    lineItems,
    newOrder,
  }: {
    lineItems: any;
    newOrder: GuestOrderDocument | OrderDocument;
  }) {
    const successUrl = `${process.env.FRONTEND_URL}/order/successful-payment?confirmationToken=${
      newOrder.confirmationToken
    }&orderNum=${newOrder.orderNumber}&email=${
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      newOrder.email ? newOrder.email : newOrder.user.email
    } `;
    const cancelUrl = `${process.env.FRONTEND_URL}/order/abandoned-payment?orderId=${newOrder._id}`;

    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return {
        sessionId: session.id,
      };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e);
    }
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

    const lineItems = this.createLineItems(newOrder);
    const stripe = await this.createStripeSession({ lineItems, newOrder });

    return {
      sessionId: stripe.sessionId,
    };
  }

  public async createPaymentSessionForUser({
    orderDate,
    promoCode,
    takeaway,
    email,
  }: Omit<CreateOrderDto, 'confirmationToken'>) {
    const newOrder = await this.ordersService.createOrder({
      orderDate,
      promoCode,
      takeaway,
      email,
      confirmationToken: this.generateConfirmationToken(),
    });

    const lineItems = this.createLineItems(newOrder);
    const stripe = await this.createStripeSession({ lineItems, newOrder });

    return {
      sessionId: stripe.sessionId,
    };
  }
}
