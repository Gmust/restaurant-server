import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 } from 'uuid';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { GetDishesInterface } from '../types/dish';
import { Roles } from '../types/user';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { CreateSpecialtiesDto } from './dto/create-specialties.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
@ApiTags('Dishes')
export class DishesController {
  constructor(private dishesService: DishesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Role(Roles.administrator)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './dishes/images',
        filename: (req, file, callback) => {
          const filename = path.parse(file.originalname).name.replace(/\s/g, '') + v4();
          const extension = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
    })
  )
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )
  async createDish(
    @UploadedFile() image: Express.Multer.File,
    @Body() createDishDto: CreateDishDto
  ) {
    console.log(createDishDto);
    if (!image) {
      throw new BadRequestException('No file uploaded');
    }

    return this.dishesService.createDish({ createDishDto, image });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/dish/:id')
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
  async getDishes(@Query() { limit, skip, isVegan, category }: GetDishesInterface) {
    return this.dishesService.getDishes({ skip, limit, isVegan, category });
  }

  @Role(Roles.administrator, Roles.cook)
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllDishes() {
    try {
      return this.dishesService.getAllDishes();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(RoleGuard, AuthGuard)
  @Post('/create-specialties-menu')
  async createSpecialtiesMenu(@Body() createSpecialtiesDto: CreateSpecialtiesDto) {
    try {
      return this.dishesService.createSpecialtiesMenu(createSpecialtiesDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/specialties-menu')
  async getSpecialtiesMenu() {
    try {
      return this.dishesService.getSpecialtiesMenu();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find')
  async getDishesByTerm(@Query('term') term: string) {
    try {
      return this.dishesService.getDishesByTerm(term);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

}
