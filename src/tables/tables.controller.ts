import {
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
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(RoleGuard, AuthGuard)
  @Post('create-table')
  async createTable(@Body() createTableDto: CreateTableDto) {
    try {
      return this.tablesService.createTable(createTableDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(RoleGuard, AuthGuard)
  @Get(':id')
  async getTable(@Param() param: { id: string }) {
    try {
      return this.tablesService.getTable(param.id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(RoleGuard, AuthGuard)
  @Get('')
  async getAllTables() {
    try {
      return this.tablesService.getAllTables();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(RoleGuard, AuthGuard)
  @Patch('update-table-info')
  async updateTableInfo(@Body() updateTableInfo: UpdateTableDto) {
    try {
      return this.tablesService.updateTableInfo(updateTableInfo);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Role(Roles.administrator)
  @UseGuards(RoleGuard, AuthGuard)
  @Delete(':id')
  async deleteTable(@Param() param: { id: string }) {
    try {
      return this.tablesService.deleteTable(param.id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
