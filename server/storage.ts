import { type User, type InsertUser, type Recipe, type InsertRecipe } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Recipe methods
  getRecipes(filters?: {
    cuisine?: string;
    dietType?: string;
    maxTime?: number;
    search?: string;
  }): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  deleteRecipe(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private recipes: Map<string, Recipe>;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getRecipes(filters?: {
    cuisine?: string;
    dietType?: string;
    maxTime?: number;
    search?: string;
  }): Promise<Recipe[]> {
    let recipes = Array.from(this.recipes.values());

    if (filters?.cuisine && filters.cuisine !== "All") {
      recipes = recipes.filter((r) => r.cuisine === filters.cuisine);
    }

    if (filters?.dietType && filters.dietType !== "All") {
      recipes = recipes.filter((r) => r.dietType === filters.dietType);
    }

    if (filters?.maxTime) {
      recipes = recipes.filter((r) => (r.prepTime + r.cookTime) <= filters.maxTime);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      recipes = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.description?.toLowerCase().includes(search) ||
          r.tags?.some((tag: string) => tag.toLowerCase().includes(search))
      );
    }

    return recipes;
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = randomUUID();
    const recipe: Recipe = {
      ...insertRecipe,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Recipe;
    this.recipes.set(id, recipe);
    return recipe;
  }

  async deleteRecipe(id: string): Promise<void> {
    this.recipes.delete(id);
  }
}

export const storage = new MemStorage();
