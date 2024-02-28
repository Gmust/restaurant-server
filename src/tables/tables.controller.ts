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
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/roles/roles.decorator';
import { Roles } from '../types/user';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';

@Controller('tables')
@ApiTags('Tables')
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
  @Get(':id')
  async getTable(@Param() param: { id: string }) {
    try {
      return this.tablesService.getTable(param.id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
  @Get('get-by-number/:tableNum')
  async getTableByNum(@Param('tableNum') tableNum: string) {
    try {
      return this.tablesService.getTableByNum(Number(tableNum));
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
