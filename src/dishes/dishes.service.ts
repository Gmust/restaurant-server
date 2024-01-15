import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Dish } from '../schemas/dish.schema';
import { GetDishesInterface } from '../types/dish';
import { dishMessages } from '../utils/constants';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(@InjectModel(Dish.name) private dishModel: Model<Dish>) {}

  async createDish({
    createDishDto,
    image,
  }: {
    createDishDto: CreateDishDto;
    image: Express.Multer.File;
  }) {
    const newDish = await this.dishModel.create({ ...createDishDto, image: image.filename });

    if (!newDish) {
      throw new ForbiddenException('Something went wrong with creating dish file!');
    }

    return {
      message: 'New dish successfully created!',
      dish: newDish,
    };
  }

  async getDish(id: string) {
    if (!id) {
      throw new BadRequestException(dishMessages.provideId);
    }

    const dish = await this.dishModel.findById(id).populate('ingredients');

    if (!dish) {
      throw new NotFoundException(dishMessages.notFound);
    }

    return dish;
  }

  async updateDish(updateDishDto: UpdateDishDto) {
    const dish = await this.dishModel.findById(updateDishDto._id).populate('ingredients');

    if (!dish) {
      throw new NotFoundException(dishMessages.notFound);
    }

    if (updateDishDto.name !== undefined) {
      dish.name = updateDishDto.name;
    }
    if (updateDishDto.price !== undefined) {
      dish.price = updateDishDto.price;
    }
    if (updateDishDto.preparationTime !== undefined) {
      dish.preparationTime = updateDishDto.preparationTime;
    }
    if (updateDishDto.category !== undefined) {
      dish.category = updateDishDto.category;
    }
    if (updateDishDto.ingredients !== undefined) {
      dish.ingredients = updateDishDto.ingredients;
    }
    if (updateDishDto.isVegan !== undefined) {
      dish.isVegan = updateDishDto.isVegan;
    }
    if (updateDishDto.description !== undefined) {
      dish.description = updateDishDto.description;
    }
    if (updateDishDto.isAvailable !== undefined) {
      dish.isAvailable = updateDishDto.isAvailable;
    }
    const updatedDish = await dish.save({ validateBeforeSave: false });

    return updatedDish;
  }

  async deleteDish(id: string) {
    if (!id) {
      throw new BadRequestException(dishMessages.provideId);
    }

    await this.dishModel.findByIdAndDelete(id);

    return {
      message: 'Dish successfully deleted',
    };
  }

  async getAllDishes({ skip = 0, limit = 10, isVegan, category }: GetDishesInterface) {
    const count = await this.dishModel.countDocuments();
    const pageTotal = Math.floor((count - 1) / limit) + 1;

    let data;

    if (isVegan && category) {
      data = await this.dishModel.find({ isVegan, category }).limit(limit).skip(skip);
    } else if (isVegan) {
      data = await this.dishModel.find({ isVegan }).limit(limit).skip(skip);
    } else if (category) {
      data = await this.dishModel.find({ category }).limit(limit).skip(skip);
    } else if (!isVegan && !category) {
      data = await this.dishModel.find().limit(limit).skip(skip);
    }

    return {
      data,
      pageTotal,
    };
  }
}
