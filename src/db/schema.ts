import { pgTable, serial, integer, text, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users_sample', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  transactionDate: date("transaction_date").notNull(),
  createdAt: date("created_at").defaultNow(),
});