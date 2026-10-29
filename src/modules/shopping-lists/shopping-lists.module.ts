import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ShoppingListsController } from './controller/shopping-lists.controller';
import { ShoppingListsRepository } from './repository/shopping-lists.repository';
import { ShoppingListsService } from './service/shopping-lists.service';
import { EstablishmentsRepository } from '../establishments/repository/establishments.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ShoppingListsController],
  providers: [
    ShoppingListsRepository,
    ShoppingListsService,
    EstablishmentsRepository,
  ],
})
export class ShoppingListsModule {}
