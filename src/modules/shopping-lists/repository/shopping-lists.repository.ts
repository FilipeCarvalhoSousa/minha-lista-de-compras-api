import { BadRequestException, Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import {
  products,
  shoppingListItemEntries,
  shoppingListItems,
  shoppingLists,
} from '../../../database/schema';
import { DatabaseService } from '../../../database/service/database.service';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from '../dto/update-shopping-list.dto';

interface ShoppingListItemEntryInsert {
  shoppingListItemId: number;
  quantity: string;
  unitPrice: string;
  discountAmount: string;
  totalPrice: string;
}

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

  async createWithItems(data: CreateShoppingListDto) {
    return this.database.db.transaction(async (tx) => {
      const [list] = await tx
        .insert(shoppingLists)
        .values({
          name: data.name,
          purchasedAt: data.purchasedAt
            ? new Date(data.purchasedAt)
            : undefined,
          establishmentId: data.establishmentId,
          source: data.source ?? 'manual',
          invoiceNumber: data.invoiceNumber,
          invoiceSeries: data.invoiceSeries,
          invoiceAccessKey: data.invoiceAccessKey,
        })

        .returning();

      const items =
        (
          data as CreateShoppingListDto & {
            items?: Array<{
              productId: number;
              quantity: number;
              unitPrice: number;
              discountAmount?: number;
            }>;
          }
        ).items ?? [];

      const grouped = new Map<number, typeof items>();

      for (const item of items) {
        const [product] = await tx
          .select({ id: products.id })
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (!product) {
          throw new BadRequestException(
            `Produto com ID ${item.productId} não encontrado.`,
          );
        }
        const entries = grouped.get(item.productId) ?? [];
        entries.push(item);
        grouped.set(item.productId, entries);
      }

      for (const [productId, entries] of grouped) {
        const quantity = entries.reduce(
          (sum, entry) => sum + entry.quantity,
          0,
        );

        const totalPrice = entries.reduce(
          (sum, entry) =>
            sum +
            Math.round(
              (entry.quantity * entry.unitPrice - (entry.discountAmount ?? 0)) *
                100,
            ) /
              100,
          0,
        );

        const lastEntry = entries[entries.length - 1];
        const [listItem] = await tx
          .insert(shoppingListItems)
          .values({
            shoppingListId: list.id,
            productId,
            quantity: quantity.toFixed(3),
            unitPrice: lastEntry.unitPrice.toFixed(2),
            discountAmount: entries
              .reduce((sum, entry) => sum + (entry.discountAmount ?? 0), 0)
              .toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          })
          .returning();

        await tx.insert(shoppingListItemEntries).values(
          entries.map((entry): ShoppingListItemEntryInsert => ({
            shoppingListItemId: listItem.id,
            quantity: entry.quantity.toFixed(3),
            unitPrice: entry.unitPrice.toFixed(2),
            discountAmount: (entry.discountAmount ?? 0).toFixed(2),
            totalPrice: (
              Math.round(
                (entry.quantity * entry.unitPrice -
                  (entry.discountAmount ?? 0)) *
                  100,
              ) / 100
            ).toFixed(2),
          })),
        );
      }

      return {
        ...list,
        items: await tx
          .select()
          .from(shoppingListItems)
          .where(eq(shoppingListItems.shoppingListId, list.id)),
      };
    });
  }
}
