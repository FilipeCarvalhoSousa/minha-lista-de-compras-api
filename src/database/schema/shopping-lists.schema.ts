import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { establishments } from './establishments.schema';

export const shoppingListSource = pgEnum(
  'shopping_list_source',
  ['manual', 'imported'],
);

export const shoppingLists = pgTable(
  'shopping_lists',
  {
    id: serial('id').primaryKey(),

    name: varchar('name', {
      length: 200,
    }).notNull(),

    source: shoppingListSource('source')
      .default('manual')
      .notNull(),

    purchasedAt: timestamp('purchased_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    establishmentId: integer('establishment_id')
      .references(() => establishments.id, {
        onDelete: 'set null',
      }),

    // Identificação opcional da nota fiscal
    invoiceNumber: varchar('invoice_number', {
      length: 30,
    }),

    invoiceSeries: varchar('invoice_series', {
      length: 10,
    }),

    invoiceAccessKey: varchar('invoice_access_key', {
      length: 44,
    }),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('shopping_lists_invoice_access_key_unique')
      .on(table.invoiceAccessKey),
  ],
);