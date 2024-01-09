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
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { GetDishesInterface } from '../types/dish';
import { Roles } from '../types/user';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
export class DishesController {
  constructor(private dishesService: DishesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('')
  async createDish(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.createDish(createDishDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getDish(@Param() params: { id: string }) {
    return this.dishesService.getDish(params.id);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  async deleteDish(@Param() params: { id: string }) {
    return this.dishesService.deleteDish(params.id);
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('')
  async updateDish(@Body() updateDishDto: UpdateDishDto) {
    return this.dishesService.updateDish(updateDishDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllDishes(@Query() { limit, skip, isVegan, category }: GetDishesInterface) {
    return this.dishesService.getAllDishes({ skip, limit, isVegan, category });
  }
}
