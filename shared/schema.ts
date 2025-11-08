import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const carbonEntries = pgTable("carbon_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  targetAmount: real("target_amount").notNull(),
  period: text("period").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCarbonEntrySchema = createInsertSchema(carbonEntries).omit({
  id: true,
  date: true,
}).extend({
  userId: z.string(),
  category: z.enum(["transportation", "energy", "food", "shopping"]),
  amount: z.number().positive(),
  description: z.string().optional(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
}).extend({
  userId: z.string(),
  targetAmount: z.number().positive(),
  period: z.enum(["daily", "weekly", "monthly"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CarbonEntry = typeof carbonEntries.$inferSelect;
export type InsertCarbonEntry = z.infer<typeof insertCarbonEntrySchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
