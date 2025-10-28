import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, boolean, timestamp, vector } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  manufacturer: text("manufacturer"),
  carbon_footprint_kg: numeric("carbon_footprint_kg").notNull(),
  annual_usage_hours: numeric("annual_usage_hours").notNull(),
  annual_carbon_impact_kg: numeric("annual_carbon_impact_kg").notNull(),
  has_api: boolean("has_api").default(false),
  api_vendor: text("api_vendor"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  created_at: true,
});

export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

export const equipmentEmbeddings = pgTable("equipment_embeddings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipment_id: varchar("equipment_id").notNull().references(() => equipment.id, { onDelete: "cascade" }),
  embedding: vector("embedding", { dimensions: 384 }),
  text_content: text("text_content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertEquipmentEmbeddingSchema = createInsertSchema(equipmentEmbeddings).omit({
  id: true,
  created_at: true,
});

export type InsertEquipmentEmbedding = z.infer<typeof insertEquipmentEmbeddingSchema>;
export type EquipmentEmbedding = typeof equipmentEmbeddings.$inferSelect;
