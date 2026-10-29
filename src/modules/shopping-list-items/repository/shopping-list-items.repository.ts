import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import {
  products,
  shoppingListItemEntries,
  shoppingListItems,
  shoppingLists,
} from '../../../database/schema';
import { DatabaseService } from '../../../database/service/database.service';
import { CreateShoppingListItemDto } from '../dto/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from '../dto/update-shopping-list-item.dto';
import {
  calculateEntryTotalCents,
  fromCents,
  toCents,
} from '../../../common/utils/money';

@Injectable()
export class ShoppingListItemsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(listId: number) {
    return this.database.db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.shoppingListId, listId))
      .orderBy(asc(shoppingListItems.id));
  }

  async findById(listId: number, id: number) {
    const [item] = await this.database.db
      .select()
      .from(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.shoppingListId, listId),
          eq(shoppingListItems.id, id),
        ),
      )
      .limit(1);

    return item;
  }

  async findByIdWithItems(id: number) {
    const [list] = await this.database.db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.id, id))
      .limit(1);

    if (!list) {
      return undefined;
    }

    const items = await this.database.db
      .select({
        id: shoppingListItems.id,
        shoppingListId: shoppingListItems.shoppingListId,
        productId: shoppingListItems.productId,
        quantity: shoppingListItems.quantity,
        unitPrice: shoppingListItems.unitPrice,
        discountAmount: shoppingListItems.discountAmount,
        totalPrice: shoppingListItems.totalPrice,
        createdAt: shoppingListItems.createdAt,

        product: {
          id: products.id,
          description: products.description,
          brand: products.brand,
          unit: products.unit,
          barcode: products.barcode,
        },
      })
      .from(shoppingListItems)
      .leftJoin(products, eq(shoppingListItems.productId, products.id))
      .where(eq(shoppingListItems.shoppingListId, id))
      .orderBy(asc(shoppingListItems.id));

    return {
      ...list,
      items,
    };
  }

  async add(listId: number, data: CreateShoppingListItemDto) {
    return this.database.db.transaction(async (tx) => {
      // 1. Validar a lista
      const [list] = await tx
        .select({ id: shoppingLists.id })
        .from(shoppingLists)
        .where(eq(shoppingLists.id, listId))
        .limit(1);

      if (!list) {
        throw new NotFoundException(
          `Lista de compras com ID ${listId} não encontrada.`,
        );
      }

      // 2. Validar se foi informado exatamente uma opção de produto
      const hasProductId = data.productId != null;
      const hasNewProduct = data.newProduct != null;

      if (hasProductId === hasNewProduct) {
        throw new BadRequestException(
          'Informe productId ou newProduct, mas não ambos.',
        );
      }

      // 3. Buscar ou cadastrar o produto
      let productId: number;

      if (hasProductId) {
        const [product] = await tx
          .select({ id: products.id })
          .from(products)
          .where(eq(products.id, data.productId!))
          .limit(1);

        if (!product) {
          throw new NotFoundException(
            `Produto com ID ${data.productId} não encontrado.`,
          );
        }

        productId = product.id;
      } else {
        const [product] = await tx
          .insert(products)
          .values({
            description: data.newProduct!.description,
            brand: data.newProduct!.brand ?? null,
            unit: data.newProduct!.unit ?? 'UN',
            barcode: data.newProduct!.barcode ?? null,
            isProvisional: false,
          })
          .returning({ id: products.id });

        productId = product.id;
      }

      // 4. Calcular o total desta inclusão
      const discount = data.discountAmount ?? 0;
      const grossTotal = Math.round(data.quantity * data.unitPrice * 100) / 100;

      if (discount > grossTotal) {
        throw new BadRequestException(
          'O desconto não pode ser maior que o valor bruto do item.',
        );
      }

      const entryTotal = Math.round((grossTotal - discount) * 100) / 100;

      // 5. Verificar se o produto já está na lista
      const [existing] = await tx
        .select()
        .from(shoppingListItems)
        .where(
          and(
            eq(shoppingListItems.shoppingListId, listId),
            eq(shoppingListItems.productId, productId),
          ),
        )
        .limit(1);

      let item;

      if (existing) {
        // Somar quantidade, desconto e total da nova inclusão
        const newQuantity = Number(existing.quantity) + data.quantity;

        const newTotal = Number(existing.totalPrice) + entryTotal;

        const newDiscount = Number(existing.discountAmount) + discount;

        [item] = await tx
          .update(shoppingListItems)
          .set({
            quantity: newQuantity.toFixed(3),
            unitPrice: data.unitPrice.toFixed(2),
            discountAmount: newDiscount.toFixed(2),
            totalPrice: newTotal.toFixed(2),
          })
          .where(eq(shoppingListItems.id, existing.id))
          .returning();
      } else {
        [item] = await tx
          .insert(shoppingListItems)
          .values({
            shoppingListId: listId,
            productId,
            quantity: data.quantity.toFixed(3),
            unitPrice: data.unitPrice.toFixed(2),
            discountAmount: discount.toFixed(2),
            totalPrice: entryTotal.toFixed(2),
          })
          .returning();
      }

      // 6. Registrar o histórico desta inclusão
      await tx.insert(shoppingListItemEntries).values({
        shoppingListItemId: item.id,
        quantity: data.quantity.toFixed(3),
        unitPrice: data.unitPrice.toFixed(2),
        discountAmount: discount.toFixed(2),
        totalPrice: entryTotal.toFixed(2),
      });

      return item;
    });
  }

  /* async create(data: CreateShoppingListItemDto) {
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
  } */

  async findPriceHistory(productId: number) {
    return this.database.db
      .select({
        entryId: shoppingListItemEntries.id,
        quantity: shoppingListItemEntries.quantity,
        unitPrice: shoppingListItemEntries.unitPrice,
        discountAmount: shoppingListItemEntries.discountAmount,
        totalPrice: shoppingListItemEntries.totalPrice,
        recordedAt: shoppingListItemEntries.createdAt,
        listId: shoppingListItems.shoppingListId,
        listName: shoppingLists.name,
        purchasedAt: shoppingLists.purchasedAt,
        establishmentId: shoppingLists.establishmentId,
      })
      .from(shoppingListItemEntries)
      .innerJoin(
        shoppingListItems,
        eq(shoppingListItemEntries.shoppingListItemId, shoppingListItems.id),
      )
      .innerJoin(
        shoppingLists,
        eq(shoppingListItems.shoppingListId, shoppingLists.id),
      )
      .where(eq(shoppingListItems.productId, productId))
      .orderBy(asc(shoppingLists.purchasedAt), asc(shoppingListItemEntries.id));
  }

  async delete(id: number) {
    const [shoppingListItem] = await this.database.db
      .delete(shoppingListItems)
      .where(eq(shoppingListItems.id, id))
      .returning();

    return shoppingListItem;
  }

  async updateLatestEntry(
    listId: number,
    itemId: number,
    data: UpdateShoppingListItemDto,
  ) {
    return this.database.db.transaction(async (tx) => {
      const [item] = await tx
        .select()
        .from(shoppingListItems)
        .where(
          and(
            eq(shoppingListItems.id, itemId),
            eq(shoppingListItems.shoppingListId, listId),
          ),
        )
        .limit(1);
      if (!item) {
        throw new NotFoundException(
          `Item ${itemId} não encontrado na lista ${listId}.`,
        );
      }

      const [latestEntry] = await tx
        .select()
        .from(shoppingListItemEntries)
        .where(eq(shoppingListItemEntries.shoppingListItemId, itemId))
        .orderBy(
          desc(shoppingListItemEntries.createdAt),
          desc(shoppingListItemEntries.id),
        )
        .limit(1);
      if (!latestEntry) {
        throw new NotFoundException(
          'Não foi encontrado um lançamento histórico para este item.',
        );
      }
      const quantity = data.quantity ?? Number(latestEntry.quantity);
      const unitPrice = data.unitPrice ?? latestEntry.unitPrice;
      const discountAmount = data.discountAmount ?? latestEntry.discountAmount;
      const totalCents = calculateEntryTotalCents(
        quantity,
        unitPrice,
        discountAmount,
      );
      await tx
        .update(shoppingListItemEntries)
        .set({
          quantity: quantity.toFixed(3),
          unitPrice: Number(unitPrice).toFixed(2),
          discountAmount: Number(discountAmount).toFixed(2),
          totalPrice: fromCents(totalCents),
        })
        .where(eq(shoppingListItemEntries.id, latestEntry.id));
      const entries = await tx
        .select()
        .from(shoppingListItemEntries)
        .where(eq(shoppingListItemEntries.shoppingListItemId, itemId));
      const totalQuantity = entries.reduce(
        (sum, entry) => sum + Number(entry.quantity),
        0,
      );
      const totalAmountCents = entries.reduce(
        (sum, entry) => sum + toCents(entry.totalPrice),
        0,
      );
      const totalDiscountCents = entries.reduce(
        (sum, entry) => sum + toCents(entry.discountAmount),
        0,
      );
      const [updatedItem] = await tx
        .update(shoppingListItems)
        .set({
          quantity: totalQuantity.toFixed(3),
          unitPrice: Number(unitPrice).toFixed(2),
          discountAmount: fromCents(totalDiscountCents),
          totalPrice: fromCents(totalAmountCents),
        })
        .where(eq(shoppingListItems.id, itemId))
        .returning();

      return updatedItem;
    });
  }

  async deleteItem(listId: number, itemId: number) {
    return this.database.db.transaction(async (tx) => {
      const [item] = await tx
        .delete(shoppingListItems)
        .where(
          and(
            eq(shoppingListItems.id, itemId),
            eq(shoppingListItems.shoppingListId, listId),
          ),
        )
        .returning();
      if (!item) {
        throw new NotFoundException(
          `Item ${itemId} não encontrado na lista ${listId}.`,
        );
      }
      // Os lançamentos históricos associados são removidos
      // automaticamente pela FK com onDelete: 'cascade';
      return item;
    });
  }
}
