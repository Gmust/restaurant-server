import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PromoCode, PromoCodeDocument } from '../schemas/promoCode.schema';
import { CreatePromoDto } from './dto/create-promo.dto';

@Injectable()
export class PromoCodeService {
  constructor(@InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCode>) {}

  async createPromoCode({
    promoCode,
    discountValue,
    expiresIn,
  }: CreatePromoDto): Promise<{ newPromoCode: PromoCodeDocument; message: string }> {
    if (new Date(expiresIn).getTime() < new Date().getTime()) {
      throw new BadRequestException('Expires in date should be in the future');
    }

    const newPromoCode = await this.promoCodeModel.create({
      promoCode,
      discountValue,
      expiresIn,
    });

    return {
      newPromoCode,
      message: 'New promo code successfully created',
    };
  }

  async getPromoCode(promoCodeId: string): Promise<PromoCode> {
    const promoCode = await this.promoCodeModel.findById(promoCodeId);

    if (!promoCode) {
      throw new BadRequestException('This promo code does not exist');
    }

    return promoCode;
  }

  async getAllPromoCodes(): Promise<PromoCodeDocument[]> {
    const currentDate = new Date();
    return this.promoCodeModel.find({ expiresIn: { $gt: currentDate } });
  }

  async deletePromoCode(promoCodeId: string) {
    await this.promoCodeModel.findByIdAndDelete(promoCodeId);
    return {
      message: 'Promo code successfully deleted',
    };
  }

  async deleteAllExpiredPromoCodes() {
    const currentDate = new Date();
    await this.promoCodeModel.deleteMany({ expiresIn: { $lt: currentDate } });
    return {
      message: 'All expired promotional codes have been successfully removed ',
    };
  }
}
