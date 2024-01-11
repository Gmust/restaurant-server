import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from '../schemas/cart.schema';
import { CartItem } from '../schemas/cartItem.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ChangeQuantityDto } from './dto/change-quantity.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItem>
  ) {}

  async createCart() {
    return this.cartModel.create({ cartItems: [], totalPrice: 0 });
  }

  async getCart(id: string) {
    if (!id) {
      throw new BadRequestException('Provide cart id!');
    }

    const cart = this.cartModel.findById(id);

    if (!cart) {
      throw new NotFoundException('Incorrect id');
    }

    return cart.populate({
      path: 'cartItems',
      populate: {
        path: 'dish',
      },
    });
  }

  async addToCart({ _id, dish, quantity }: AddToCartDto) {
    const cart = await this.cartModel.findById(_id).populate('cartItems').exec();

    if (!cart) {
      throw new NotFoundException('Incorrect cart id');
    }

    if (cart.cartItems.some((cartItem: any) => cartItem.dish._id == dish._id)) {
      throw new BadRequestException('You cannot add product that is already in your cart');
    }

    const newCartItem = await this.cartItemModel.create({ dish, quantity });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    cart.cartItems.push(newCartItem._id);

    await cart.populate({
      path: 'cartItems',
      populate: {
        path: 'dish',
      },
    });

    cart.totalPrice = cart.cartItems.reduce((totalPrice, cartItem: any) => {
      return totalPrice + cartItem.dish.price * cartItem.quantity;
    }, 0);

    await cart.save();
    return {
      message: 'Item successfully added',
      cart: cart,
    };
  }

  async changeQuantity({ newQuantity, cartItemId, cartId }: ChangeQuantityDto) {
    const cartItem = await this.cartItemModel.findById(cartItemId);
    cartItem.quantity = newQuantity;
    await cartItem.save();

    const cart = await this.cartModel.findById(cartId).populate('cartItems').exec();

    await cart.populate({
      path: 'cartItems',
      populate: {
        path: 'dish',
      },
    });

    cart.totalPrice = cart.cartItems.reduce((totalPrice, cartItem: any) => {
      return totalPrice + cartItem.dish.price * cartItem.quantity;
    }, 0);

    await cart.save();

    return {
      cart: cart,
    };
  }

  async removerFromCart({ cartItemId, cartId }: RemoveFromCartDto) {
    const cart = await this.cartModel.findById(cartId);
    const cartItem = await this.cartItemModel.findById(cartItemId).populate('dish').exec();

    cart.cartItems = cart.cartItems.filter(cartItem => String(cartItem) !== String(cartItemId));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    cart.totalPrice = cart.totalPrice - cartItem.dish.price * cartItem.quantity;

    cart.save();

    await this.cartItemModel.findByIdAndDelete(cartItemId);

    return {
      message: 'Item successfully removed',
      cart: cart,
    };
  }

  async emptyCart(cartId: string) {
    const cart = await this.cartModel.findById(cartId);

    cart.cartItems.forEach(async cartItem => {
      await this.cartItemModel.findByIdAndDelete(cartItem);
    });

    cart.cartItems = [];
    cart.totalPrice = 0;

    cart.save();

    return {
      message: 'The cart has been successfully emptied!',
    };
  }
}
