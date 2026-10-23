import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ShoppingListItemsController } from './controller/shopping-list-items.controller';
import { ShoppingListItemsRepository } from './repository/shopping-list-items.repository';
import { ShoppingListItemsService } from './service/shopping-list-items.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ShoppingListItemsController],
  providers: [ShoppingListItemsRepository, ShoppingListItemsService],
})
export class ShoppingListItemsModule {}
