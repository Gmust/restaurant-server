import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { Table, TableSchema } from '../schemas/table.schema';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

@Module({
  imports: [MongooseModule.forFeature([{ schema: TableSchema, name: Table.name }]), AuthModule],
  providers: [TablesService],
  controllers: [TablesController],
  exports: [TablesService],
})
export class TablesModule {}
