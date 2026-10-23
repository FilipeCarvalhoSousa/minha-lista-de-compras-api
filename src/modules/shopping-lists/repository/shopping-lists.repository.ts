import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { shoppingLists } from '../../../database/schema';
import { DatabaseService } from '../../../database/service/database.service';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from '../dto/update-shopping-list.dto';

@Injectable()
export class ShoppingListsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    return this.database.db
      .select()
      .from(shoppingLists)
      .orderBy(asc(shoppingLists.id));
  }

  async findById(id: number) {
    const [shoppingList] = await this.database.db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.id, id))
      .limit(1);

    return shoppingList;
  }

  async findByInvoiceAccessKey(invoiceAccessKey: string) {
    const [shoppingList] = await this.database.db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.invoiceAccessKey, invoiceAccessKey))
      .limit(1);

    return shoppingList;
  }

  async create(data: CreateShoppingListDto) {
    const [shoppingList] = await this.database.db
      .insert(shoppingLists)
      .values({
        name: data.name,
        source: data.source,
        purchasedAt: data.purchasedAt ? new Date(data.purchasedAt) : undefined,
        establishmentId: data.establishmentId,
        invoiceNumber: data.invoiceNumber,
        invoiceSeries: data.invoiceSeries,
        invoiceAccessKey: data.invoiceAccessKey,
      })
      .returning();

    return shoppingList;
  }

  async update(id: number, data: UpdateShoppingListDto) {
    const [shoppingList] = await this.database.db
      .update(shoppingLists)
      .set({
        name: data.name,
        source: data.source,
        purchasedAt: data.purchasedAt ? new Date(data.purchasedAt) : undefined,
        establishmentId: data.establishmentId,
        invoiceNumber: data.invoiceNumber,
        invoiceSeries: data.invoiceSeries,
        invoiceAccessKey: data.invoiceAccessKey,
      })
      .where(eq(shoppingLists.id, id))
      .returning();

    return shoppingList;
  }

  async delete(id: number) {
    const [shoppingList] = await this.database.db
      .delete(shoppingLists)
      .where(eq(shoppingLists.id, id))
      .returning();

    return shoppingList;
  }
}
