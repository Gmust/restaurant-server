import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { Ingredient, IngredientSchema } from '../schemas/ingredient.schema';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: IngredientSchema, name: Ingredient.name }]),
    AuthModule,
  ],
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
