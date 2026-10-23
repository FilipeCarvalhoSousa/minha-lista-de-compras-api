import {
  pgTable,
  serial,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),

  description: varchar('description', {
    length: 300,
  }).notNull(),

  brand: varchar('brand', {
    length: 150,
  }),

  barcode: varchar('barcode', {
    length: 14,
  }),

  unit: varchar('unit', {
    length: 20,
  })
    .default('UN')
    .notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});