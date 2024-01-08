import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('')
  async createIngredient(@Body() createIngredientsDto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(createIngredientsDto);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  async getIngredient(@Param() params: { id: string }) {
    return this.ingredientsService.getIngredient(params.id);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  async deleteIngredient(@Param() params: { id: string }) {
    return this.ingredientsService.deleteIngredient(params.id);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('')
  async updateIngredient(@Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.updateIngredient(updateIngredientDto);
  }
}
