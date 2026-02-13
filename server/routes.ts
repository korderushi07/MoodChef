import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecipeSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Recipe routes
  app.get("/api/recipes", async (req, res) => {
    const { cuisine, dietType, maxTime, search } = req.query;
    const recipes = await storage.getRecipes({
      cuisine: cuisine as string | undefined,
      dietType: dietType as string | undefined,
      maxTime: maxTime ? parseInt(maxTime as string) : undefined,
      search: search as string | undefined,
    });
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const recipe = await storage.getRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  });

  app.post("/api/recipes", async (req, res) => {
    try {
      const parsed = insertRecipeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }
      const recipe = await storage.createRecipe(parsed.data);
      res.status(201).json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Failed to create recipe" });
    }
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    await storage.deleteRecipe(req.params.id);
    res.status(204).send();
  });

  return httpServer;
}
