import {
  index,
  numeric,
  pgTable,
  serial,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

import { shoppingListItems } from './shopping-list-items.schema';

export const shoppingListItemEntries = pgTable(
  'shopping_list_item_entries',
  {
    id: serial('id').primaryKey(),

    shoppingListItemId: integer('shopping_list_item_id')
      .notNull()
      .references(() => shoppingListItems.id, {
        onDelete: 'cascade',
      }),

    quantity: numeric('quantity', {
      precision: 12,
      scale: 3,
    }).notNull(),

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
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('shopping_list_item_entries_item_id_idx').on(
      table.shoppingListItemId,
    ),
    index('shopping_list_item_entries_created_at_idx').on(table.createdAt),
  ],
);
