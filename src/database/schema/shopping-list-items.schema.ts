import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

import { shoppingLists } from './shopping-lists.schema';
import { products } from './products.schema';

export const shoppingListItems = pgTable(
  'shopping_list_items',
  {
    id: serial('id').primaryKey(),

    shoppingListId: integer('shopping_list_id')
      .notNull()
      .references(() => shoppingLists.id, {
        onDelete: 'cascade',
      }),

    productId: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onDelete: 'restrict',
      }),

    quantity: numeric('quantity', {
      precision: 12,
      scale: 3,
    })
      .notNull()
      .default('1'),

    unitPrice: numeric('unit_price', {
      precision: 12,
      scale: 2,
    }).notNull(),

    discountAmount: numeric('discount_amount', {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default('0'),

    totalPrice: numeric('total_price', {
      precision: 12,
      scale: 2,
    }).notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('shopping_list_items_list_idx')
      .on(table.shoppingListId),

    index('shopping_list_items_product_idx')
      .on(table.productId),
  ],
);