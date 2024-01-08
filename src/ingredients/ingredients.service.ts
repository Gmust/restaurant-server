import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ingredient, IngredientDocument } from '../schemas/ingredient.schema';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(@InjectModel(Ingredient.name) private ingredientModel: Model<Ingredient>) {}

  async getIngredient(id: string): Promise<IngredientDocument> {
    const ingredient = this.ingredientModel.findById(id);
    if (!ingredient) {
      throw new BadRequestException('Ingredient with this ID does not exist');
    }
    return ingredient;
  }

  async createIngredient({ name, unit, quantity }: CreateIngredientDto) {
    const ingredient = await this.ingredientModel.create({ name, unit, quantity });
    return {
      message: 'Ingredient successfully created!',
      ingredient: ingredient,
    };
  }

  async updateIngredient({ id, quantity, name, unit }: UpdateIngredientDto): Promise<Ingredient> {
    if (!id) {
      throw new BadRequestException('Provide Id');
    }
    return this.ingredientModel.findByIdAndUpdate(id, { name, unit, quantity });
  }

  async deleteIngredient(id: string) {
    if (!id) {
      throw new BadRequestException('Provide Id');
    }
    await this.ingredientModel.findByIdAndDelete(id);

    return {
      message: 'Ingredient successfully deleted!',
    };
  }
}
