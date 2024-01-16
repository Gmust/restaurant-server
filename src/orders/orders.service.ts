import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { CartService } from '../cart/cart.service';
import { MailingService } from '../mailing/mailing.service';
import { PromoCodeService } from '../promo-code/promo-code.service';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderItem } from '../schemas/orderItem.schema';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GenerateOrderDocumentDto } from './dto/generate-order-document.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    private promoCodeService: PromoCodeService,
    private usersService: UsersService,
    private cartService: CartService,
    private mailerService: MailingService
  ) {}

  async createOrder({
    orderDate,
    promoCode,
    takeaway,
    email,
  }: CreateOrderDto): Promise<{ newOrder: OrderDocument } | { message: string }> {
    if (new Date(orderDate).getTime() + 100 * 60 < new Date().getTime()) {
      throw new BadRequestException('Order can`t be created in the past');
    }

    const user = await this.usersService.findOne(email);
    const userCart = await this.cartService.getCart(String(user.cart));
    const orderItems: OrderItem[] | null = [];

    for (const cartItem of userCart.cartItems) {
      const newOrderItem = await this.orderItemModel.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dish: cartItem.dish,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        quantity: cartItem.quantity,
      });
      orderItems.push(newOrderItem);
    }

    if (orderItems.length < 1) {
      throw new InternalServerErrorException('Something went wrong!');
    }

    if (promoCode) {
      const promoCodeDb = await this.promoCodeService.getPromoCode(promoCode);
      userCart.totalPrice = userCart.totalPrice * (promoCodeDb.discountValue / 100);
      await userCart.save({ validateBeforeSave: false });
    }
    const orderDoc = await this.generateOrderDocument({
      email,
      totalPrice: userCart.totalPrice,
      orderItems,
    });

    if (!orderDoc) {
      throw new InternalServerErrorException('Something went wrong!');
    }
    await this.mailerService.sentOrderDocument({ email, document: orderDoc });

    const newOrder = await this.orderModel.create({
      totalPrice: userCart.totalPrice,
      orderItems,
      takeaway,
    });

    if (!newOrder) {
      throw new InternalServerErrorException('Something went wrong!');
    }

    user.orders.push(newOrder._id);
    await user.save({ validateBeforeSave: false });

    return {
      newOrder,
      message: 'A new order has been created and the document has been sent to your email!',
    };
  }

  private async generateOrderDocument({ email, totalPrice, orderItems }: GenerateOrderDocumentDto) {
    const fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
      },
    };

    const printer = new PdfPrinter(fonts);
    const content = [
      { text: 'Your Order:', style: 'header' },
      '\n',
      { text: `Email: ${email}`, style: 'subheader' },
      { text: `Total Price: $${totalPrice.toFixed(2)}`, style: 'subheader' },
      { text: 'Dishes:', style: 'subheader' },
      ...orderItems.map(({ dish, quantity }: { dish: any; quantity: number }) => ({
        columns: [
          {
            image: join(__dirname, '../../dishes', 'images', dish.image),
            width: 50,
            height: 50,
            alignment: 'center',
          },
          {
            text: [
              { text: `${dish.name}\n`, bold: true },
              { text: `Description: ${dish.description}\n` },
              { text: `Price: $${dish.price.toFixed(2)}\n` },
              { text: `Category: ${dish.category}\n` },
              { text: `Quantity: ${quantity}\n`, bold: true },
            ],
            style: 'dishesContainer',
          },
        ],
        margin: [0, 0, 0, 10],
      })),
    ];

    const docDefinition = {
      content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        dishesContainer: {
          fontSize: 12,
          margin: [10, 0, 0, 0],
        },
      },
    } as TDocumentDefinitions;

    const pdfDocument = printer.createPdfKitDocument(docDefinition);
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      pdfDocument.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      pdfDocument.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      pdfDocument.on('error', (error: Error) => {
        reject(error);
      });

      pdfDocument.end();
    });
  }

  public async updateOrderStatus({ orderId, newStatus, userId }: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new BadRequestException('Invalid order id!');
    }
    order.status = newStatus;
    order.save({ validateBeforeSave: false });
    return {
      orderId: orderId,
      newStatus: newStatus,
      userId,
    };
  }
}
