import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { ProductsRepository } from './repository/products.repository';

@Module({
  imports: [DatabaseModule], 
  controllers: [ProductsController], 
  providers: [ProductsRepository, ProductsService],
})
export class ProductsModule {}
