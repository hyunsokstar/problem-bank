import { Module } from '@nestjs/common';
import { ItemAdminService } from './item-admin.service';
import { ItemAdminController } from './item-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModel } from './entities/item-admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsModel
    ])
  ],
  controllers: [ItemAdminController],
  providers: [ItemAdminService],
})
export class ItemAdminModule { }


