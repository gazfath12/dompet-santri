import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users_sample', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  displayName: text('display_name'), // Tambahan field display name
});

export const transactions = pgTable('transactions_sample', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  transactionDate: timestamp('transaction_date').defaultNow(), // Tambahan field tanggal transaksi
});