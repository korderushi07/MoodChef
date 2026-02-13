import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  jsonb,
  timestamp,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const cuisineEnum = pgEnum("cuisine_type", [
  "Italian",
  "Asian",
  "Mexican",
  "Indian",
  "American",
  "Mediterranean",
  "Thai",
  "French",
  "Japanese",
  "Middle Eastern",
]);

export const dietEnum = pgEnum("diet_type", [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Regular",
]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  cuisine: cuisineEnum("cuisine").notNull(),
  dietType: dietEnum("diet_type").notNull(),
  prepTime: integer("prep_time").notNull(), // in minutes
  cookTime: integer("cook_time").notNull(), // in minutes
  servings: integer("servings").notNull(),
  ingredients: jsonb("ingredients").notNull(), // Array of {name, amount, unit, required}
  instructions: jsonb("instructions").notNull(), // Array of step strings
  imageUrl: text("image_url"),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("0"),
  tags: jsonb("tags").default(sql`'[]'::jsonb`), // Array of tag strings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
