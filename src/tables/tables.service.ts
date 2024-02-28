import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Table, TableDocument } from '../schemas/table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(@InjectModel(Table.name) private tableModel: Model<Table>) {}

  async getTable(tableId: string) {
    return this.tableModel.findById(tableId);
  }

  async getAllTables() {
    return this.tableModel.find();
  }

  async createTable({ tableNum, numberOfSeats, isAvailable }: CreateTableDto) {
    const newTable = await this.tableModel.create({ tableNum, numberOfSeats, isAvailable });
    return {
      newTable,
      message: 'New table created successfully',
    };
  }

  async updateTableInfo({ tableNum, numberOfSeats, isAvailable, tableId }: UpdateTableDto) {
    const table = await this.tableModel.findById(tableId);

    if (tableNum !== undefined) {
      table.tableNum = tableNum;
    }
    if (numberOfSeats !== undefined) {
      table.numberOfSeats = numberOfSeats;
    }
    if (isAvailable !== undefined) {
      table.isAvailable = isAvailable;
    }
    table.save();
    return {
      updatedTable: table,
      message: 'Table successfully updated!',
    };
  }

  async deleteTable(tableId: string) {
    await this.tableModel.findByIdAndDelete(tableId);
    return {
      message: 'Table successfully deleted',
    };
  }

  async getTableByNum(tableNum: number): Promise<TableDocument | null> {
    const table = await this.tableModel.findOne({ tableNum: tableNum });
    if (!table) {
      throw new NotFoundException('Invalid table number');
    } else {
      return table;
    }
  }
}
