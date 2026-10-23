import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const establishments = pgTable(
  'establishments',
  {
    id: serial('id').primaryKey(),

    name: varchar('name', { length: 200 }).notNull(),

    cnpj: varchar('cnpj', { length: 14 }),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('establishments_cnpj_unique').on(table.cnpj),
  ],
);