import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ShoppingListItemsController } from './controller/shopping-list-items.controller';
import { ShoppingListItemsRepository } from './repository/shopping-list-items.repository';
import { ShoppingListItemsService } from './service/shopping-list-items.service';
import { ProductsModule } from '../products/products.module';
import { ShoppingListsModule } from '../shopping-lists/shopping-lists.module';
import { ShoppingListsRepository } from '../shopping-lists/repository/shopping-lists.repository';
import { ProductsRepository } from '../products/repository/products.repository';

@Module({
  imports: [DatabaseModule, ProductsModule, ShoppingListsModule],
  controllers: [ShoppingListItemsController],
  providers: [
    ShoppingListItemsService,
    ShoppingListItemsRepository,
    ShoppingListsRepository,
    ProductsRepository,
  ],
})
export class ShoppingListItemsModule {}
