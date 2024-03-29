import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { Dish, DishSchema } from '../schemas/dish.schema';
import { Specialties, SpecialtiesSchema } from '../schemas/specialties.schema';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: DishSchema,
        name: Dish.name,
      },
      {
        schema: SpecialtiesSchema,
        name: Specialties.name,
      },
    ]),
    AuthModule,
  ],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
