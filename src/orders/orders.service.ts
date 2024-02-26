import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { CartService } from '../cart/cart.service';
import { MailingService } from '../mailing/mailing.service';
import { PromoCodeService } from '../promo-code/promo-code.service';
import { CartItem } from '../schemas/cartItem.schema';
import { GuestOrder, GuestOrderDocument } from '../schemas/guestOrder.schema';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderItem } from '../schemas/orderItem.schema';
import { UsersService } from '../users/users.service';
import { bufferPdf } from '../utils/bufferPdf';
import { CompleteOrderDto } from './dto/complete-order.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeleteOrderDto } from './dto/delete-order.dto';
import { GenerateOrderDocumentDto } from './dto/generate-order-document.dto';
import { GetOrderInfoDto } from './dto/get-order-info.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItem>,
    @InjectModel(GuestOrder.name) private guestOrderModel: Model<GuestOrder>,
    private promoCodeService: PromoCodeService,
    private usersService: UsersService,
    private cartService: CartService,
    private mailerService: MailingService
  ) {}

  private async fillOrderItems(cartItems: CartItem[]): Promise<OrderItem[]> {
    const orderItems: OrderItem[] = [];

    for (const cartItem of cartItems) {
      const newOrderItem = await this.orderItemModel.create({
        dish: cartItem.dish,
        quantity: cartItem.quantity,
      });
      orderItems.push(newOrderItem);
    }
    return orderItems;
  }

  private generateOrderNumber(): string {
    return 'ORD' + Math.floor(1000 + Math.random() * 9000);
  }

  async createOrder({
    orderDate,
    promoCode,
    takeaway,
    email,
    confirmationToken,
  }: CreateOrderDto): Promise<{ newOrder: OrderDocument } | { message: string }> {
    if (new Date(orderDate).getTime() + 100 * 60 < new Date().getTime()) {
      throw new BadRequestException('Order can`t be created in the past');
    }

    const userBD = await this.usersService.findOne(email);
    const userCart = await this.cartService.getCart(String(userBD.cart));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const orderItems: OrderItem[] = await this.fillOrderItems(userCart.cartItems);
    if (orderItems.length < 1) {
      throw new BadRequestException('Please add dishes to your cart');
    }

    if (promoCode) {
      const promoCodeDb = await this.promoCodeService.getPromoCode(promoCode);
      userCart.totalPrice = userCart.totalPrice * (promoCodeDb.discountValue / 100);
      await userCart.save({ validateBeforeSave: false });
    }
    const orderNumber = this.generateOrderNumber();

    const orderDoc = await this.generateOrderDocument({
      email,
      totalPrice: userCart.totalPrice,
      orderItems,
      orderNumber,
    });

    if (!orderDoc) {
      throw new InternalServerErrorException('Something went wrong!');
    }
    await this.mailerService.sendMailWithAttachment({
      email,
      document: orderDoc,
      subject: 'Order',
      template: 'test-template',
    });

    userCart.totalPrice = 0;
    userCart.cartItems = [];

    userCart.save({ validateBeforeSave: false });

    const newOrder = await this.orderModel.create({
      totalPrice: userCart.totalPrice,
      orderItems,
      takeaway,
      user: userBD,
      promoCode,
      orderNumber,
      confirmationToken,
    });

    if (!newOrder) {
      throw new InternalServerErrorException('Something went wrong!');
    }

    userBD.orders.push(newOrder._id);
    await userBD.save({ validateBeforeSave: false });

    return {
      newOrder,
      message: 'A new order has been created and the document has been sent to your email!',
    };
  }

  public async createOrderForGuest({
    orderDate,
    promoCode,
    takeaway,
    email,
    cartItems,
    totalPrice,
    confirmationToken,
  }: CreateGuestOrderDto): Promise<GuestOrderDocument> {
    if (new Date(orderDate).getTime() + 100 * 60 < new Date().getTime()) {
      throw new BadRequestException('Order can`t be created in the past');
    }

    const orderItems: OrderItem[] = await this.fillOrderItems(cartItems);

    if (orderItems.length < 1) {
      throw new BadRequestException('Please add dishes to your cart');
    }

    if (promoCode) {
      const promoCodeDb = await this.promoCodeService.getPromoCode(promoCode);
      totalPrice = totalPrice * (promoCodeDb.discountValue / 100);
    }

    const orderNumber = this.generateOrderNumber();

    const guestOrder = await this.guestOrderModel.create({
      totalPrice,
      orderItems,
      takeaway,
      email,
      promoCode,
      orderNumber,
      confirmationToken,
    });

    if (!guestOrder) {
      throw new InternalServerErrorException('Something went wrong!');
    }

    console.log(
      guestOrder.populate({
        path: 'orderItems',
        populate: {
          path: 'dish',
        },
      })
    );

    return guestOrder.populate({
      path: 'orderItems',
      populate: {
        path: 'dish',
      },
    });
  }

  private async generateOrderDocument({
    email,
    totalPrice,
    orderItems,
    orderNumber,
  }: GenerateOrderDocumentDto) {
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
      { text: `Your Order number ${orderNumber}:`, style: 'header' },
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
    return bufferPdf(pdfDocument);
  }

  public async getOrderInfo({
    orderNumber,
    email,
  }: GetOrderInfoDto): Promise<GuestOrderDocument | OrderDocument> {
    const user = await this.usersService.findOne(email);

    if (user) {
      const userOrder = await this.orderModel.findOne({ user: user._id, orderNumber }).populate({
        path: 'orderItems',
        populate: {
          path: 'dish',
        },
      });

      if (!userOrder) {
        throw new BadRequestException('Invalid email or order info');
      }

      return userOrder;
    } else {
      const guestOrder = await this.guestOrderModel.findOne({ email, orderNumber }).populate({
        path: 'orderItems',
        populate: {
          path: 'dish',
        },
      });

      if (!guestOrder) {
        throw new BadRequestException('Invalid email or order info');
      }

      return guestOrder;
    }
  }

  public async deleteOrder({ orderId }: DeleteOrderDto) {
    await this.orderModel.findByIdAndDelete(orderId);
    await this.guestOrderModel.findByIdAndDelete(orderId);
    return {
      message: 'Success',
    };
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

  public async completeOrder({ orderId }: CompleteOrderDto) {
    const order = await this.orderModel.findById(orderId);
    const user = await this.usersService.findById(order.user);

    user.orders = user.orders.filter(order => String(order.id) == String(orderId));
    await user.save({ validateBeforeSave: false });

    await this.orderModel.findByIdAndDelete(orderId);

    return {
      message: 'Order Successfully completed!',
    };
  }

  public async confirmOrder({ email, orderNumber, confirmationToken }: ConfirmOrderDto) {
    const order = await this.getOrderInfo({ orderNumber, email });

    if (order.confirmationToken !== confirmationToken) {
      throw new BadRequestException('Invalid confirmation token');
    }

    order.isConfirmed = true;
    order.save({ validateBeforeSave: false });

    const orderDoc = await this.generateOrderDocument({
      email,
      totalPrice: order.totalPrice,
      orderItems: order.orderItems as unknown as OrderItem[],
      orderNumber,
    });

    if (!orderDoc) {
      throw new InternalServerErrorException('Something went wrong!');
    }

    await this.mailerService.sendMailWithAttachment({
      email,
      document: orderDoc,
      subject: 'Order',
      template: 'test-template',
    });

    return {
      message:
        'Order info was sent to your email, use your email and order number to get status of your order',
    };
  }

  public async deleteAllUnconfirmedOrders() {
    await this.orderItemModel.deleteMany({ isConfirmed: false });
  }
}
