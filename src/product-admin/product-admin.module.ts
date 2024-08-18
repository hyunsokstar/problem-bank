import { Module } from '@nestjs/common';
import { ProductAdminService } from './product-admin.service';
import { ProductAdminController } from './product-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product.category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategory
    ])
  ],
  controllers: [ProductAdminController],
  providers: [ProductAdminService],
})
export class ProductAdminModule { }
