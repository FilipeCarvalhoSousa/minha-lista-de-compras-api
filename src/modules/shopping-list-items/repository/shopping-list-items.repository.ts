import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { shoppingListItems } from '../../../database/schema';
import { DatabaseService } from '../../../database/service/database.service';
import { CreateShoppingListItemDto } from '../dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from '../dto/update-shopping-list-item.dto';

@Injectable()
export class ShoppingListItemsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.db
      .select()
      .from(shoppingListItems)
      .orderBy(asc(shoppingListItems.id));
  }

  async findById(id: number) {
    const [shoppingListItem] = await this.database.db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.id, id))
      .limit(1);

    return shoppingListItem;
  }

  async create(data: CreateShoppingListItemDto) {
    const [shoppingListItem] = await this.database.db
      .insert(shoppingListItems)
      .values({
        shoppingListId: data.shoppingListId,
        productId: data.productId,
        quantity: data.quantity?.toString(),
        unitPrice: data.unitPrice.toString(),
        discountAmount: data.discountAmount?.toString(),
        totalPrice: data.totalPrice.toString(),
      })
      .returning();

    return shoppingListItem;
  }

  async update(id: number, data: UpdateShoppingListItemDto) {
    const [shoppingListItem] = await this.database.db
      .update(shoppingListItems)
      .set({
        shoppingListId: data.shoppingListId,
        productId: data.productId,
        quantity: data.quantity?.toString(),
        unitPrice: data.unitPrice?.toString(),
        discountAmount: data.discountAmount?.toString(),
        totalPrice: data.totalPrice?.toString(),
      })
      .where(eq(shoppingListItems.id, id))
      .returning();

    return shoppingListItem;
  }

  async delete(id: number) {
    const [shoppingListItem] = await this.database.db
      .delete(shoppingListItems)
      .where(eq(shoppingListItems.id, id))
      .returning();

    return shoppingListItem;
  }
}
