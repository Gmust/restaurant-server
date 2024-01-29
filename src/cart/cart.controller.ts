import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ChangeQuantityDto } from './dto/change-quantity.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthGuard)
  @Get()
  async getCart(@Body() { cartId }: { cartId: string }) {
    return this.cartService.getCart(cartId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('add-to-cart')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('change-quantity')
  async changeProductItemQuantity(@Body() changeQuantityDto: ChangeQuantityDto) {
    return this.cartService.changeQuantity(changeQuantityDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete('remove-form-cart')
  async removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.removerFromCart(removeFromCartDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete('empty-cart')
  async emptyCart(@Body() { cartId }: { cartId: string }) {
    return this.cartService.emptyCart(cartId);
  }
}
