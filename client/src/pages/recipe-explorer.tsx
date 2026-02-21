import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeFilters, type RecipeFilters as IRecipeFilters } from "@/components/recipe-filters";
import { type Recipe } from "@shared/schema";
import RecipeDetailPage from "@/pages/recipe-detail";

export default function RecipeExplorer() {
  const [, navigate] = useLocation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filters, setFilters] = useState<IRecipeFilters>({
    search: "",
    cuisine: "",
    dietType: "",
    maxTime: undefined,
    mood: "", // ← new
  });

  // Fetch recipes from API (cuisine/dietType/maxTime/search go to server)
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.cuisine)  params.append("cuisine",  filters.cuisine);
        if (filters.dietType) params.append("dietType", filters.dietType);
        if (filters.maxTime)  params.append("maxTime",  filters.maxTime.toString());
        if (filters.search)   params.append("search",   filters.search);
        // NOTE: mood is filtered client-side below (no API param needed)

        const response = await fetch(`/api/recipes?${params}`);
        if (!response.ok) throw new Error("Failed to fetch recipes");
        const data: Recipe[] = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(timer);
  }, [filters.cuisine, filters.dietType, filters.maxTime, filters.search]);
  // ↑ mood intentionally excluded — handled client-side

  // Client-side mood filter applied on top of server results
  useEffect(() => {
    if (!filters.mood) {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(
        recipes.filter((recipe) => {
          const recipeMood = (recipe as any).mood;
          if (!recipeMood) return false;
          if (Array.isArray(recipeMood)) return recipeMood.includes(filters.mood);
          return recipeMood === filters.mood;
        })
      );
    }
  }, [recipes, filters.mood]);

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  if (selectedRecipe) {
    return (
      <RecipeDetailPage
        recipeId={selectedRecipe.id}
        onBack={handleCloseDetail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Recipe Explorer</h1>
              </div>
              <p className="text-muted-foreground">
                Discover delicious recipes filtered by cuisine, diet type, and cooking time
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters (includes mood buttons) */}
        <RecipeFilters filters={filters} onFiltersChange={setFilters} />

        {/* Loading */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to discover more recipes
            </p>
            <Button
              onClick={() =>
                setFilters({ search: "", cuisine: "", dietType: "", maxTime: undefined, mood: "" })
              }
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Recipe Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>

            {/* Results count */}
            <div className="text-center mt-8 text-muted-foreground">
              Showing {filteredRecipes.length} recipe
              {filteredRecipes.length !== 1 ? "s" : ""}
              {filters.mood ? ` with a "${filters.mood}" mood` : ""}
            </div>
          </>
        )}
      </main>
    </div>
  );
}