import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { CreatePromoDto } from './dto/create-promo.dto';
import { PromoCodeService } from './promo-code.service';

@Controller('promo-code')
export class PromoCodeController {
  constructor(private promoCodeService: PromoCodeService) {}

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('')
  async createNewPromoCode(@Body() createPromoDto: CreatePromoDto) {
    return this.promoCodeService.createPromoCode(createPromoDto);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':promoCodeId')
  async getPromoCode(@Param() params: { promoCodeId: string }) {
    return this.promoCodeService.getPromoCode(params.promoCodeId);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('')
  async getAllPromoCodes() {
    return this.promoCodeService.getAllPromoCodes();
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('delete-one/:promoCodeId')
  async deletePromoCode(@Param() params: { promoCodeId: string }) {
    return this.promoCodeService.deletePromoCode(params.promoCodeId);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/delete-all-expired')
  async deleteAllExpiredPromoCodes() {
    return this.promoCodeService.deleteAllExpiredPromoCodes();
  }
}
