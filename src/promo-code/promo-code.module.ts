import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { PromoCode, PromoCodeSchema } from '../schemas/promoCode.schema';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: PromoCodeSchema, name: PromoCode.name }]),
    AuthModule,
  ],
  providers: [PromoCodeService],
  controllers: [PromoCodeController],
  exports: [PromoCodeService],
})
export class PromoCodeModule {}
