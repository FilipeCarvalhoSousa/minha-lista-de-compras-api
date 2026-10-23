import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './modules/products/products.module';
import { EstablishmentsModule } from './modules/establishments/establishments.module';
import { ShoppingListsModule } from './modules/shopping-lists/shopping-lists.module';
import { ShoppingListItemsModule } from './modules/shopping-list-items/shopping-list-items.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'minha-lista-de-compras-api',
    }),
    DatabaseModule,
    ProductsModule,
    EstablishmentsModule,
    ShoppingListsModule,
    ShoppingListItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
