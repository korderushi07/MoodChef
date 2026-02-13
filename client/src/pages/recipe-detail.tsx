import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Clock, Users, ChefHat, Flame, UtensilsCrossed, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type Recipe } from "@shared/schema";

interface RecipeDetailPageProps {
  recipeId?: string;
  onBack?: () => void;
}

export default function RecipeDetailPage({
  recipeId,
  onBack,
}: RecipeDetailPageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, params] = useRoute("/recipe/:id");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [servings, setServings] = useState(1);
  const [, navigate] = useLocation();
  const id = recipeId || params?.id;

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) throw new Error("Recipe not found");
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const toggleIngredient = (idx: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(idx)) {
      newChecked.delete(idx);
    } else {
      newChecked.add(idx);
    }
    setCheckedIngredients(newChecked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full mb-6 rounded-lg" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Recipe Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "The recipe you're looking for doesn't exist."}</p>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const ingredients = recipe.ingredients as Array<{
    name: string;
    amount: string | number;
    unit: string;
    required: boolean;
  }>;
  const instructions = recipe.instructions as string[];
  const tags = recipe.tags as string[];
  const totalTime = recipe.prepTime + recipe.cookTime;
  const rating = parseFloat(recipe.rating as unknown as string);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {/* Hero Image */}
        <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6 group">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <UtensilsCrossed className="h-24 w-24 text-muted-foreground/30" />
            </div>
          )}

          {/* Badge Overlay */}
          <div className="absolute top-4 left-4 right-4 flex gap-2 flex-wrap">
            <Badge className="bg-primary/90 text-primary-foreground text-base py-1 px-3">
              {recipe.cuisine}
            </Badge>
            <Badge variant="secondary" className="text-base py-1 px-3">
              {recipe.dietType}
            </Badge>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="absolute top-4 right-4 bg-yellow-500/95 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              ★ {rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {recipe.description}
          </p>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap gap-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Total Time</div>
                <div className="font-semibold">{totalTime} minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-xs text-muted-foreground">Prep Time</div>
                <div className="font-semibold">{recipe.prepTime} min</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-amber-600" />
              <div>
                <div className="text-xs text-muted-foreground">Cook Time</div>
                <div className="font-semibold">{recipe.cookTime} min</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Servings</div>
                <div className="font-semibold flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={() => setServings(Math.max(1, servings - 1))}
                  >
                    −
                  </Button>
                  <span className="w-6 text-center">{servings}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={() => setServings(servings + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Ingredients */}
          <Card className="p-6 md:col-span-1 bg-card/50 border-border/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              Ingredients
            </h2>

            {/* Required Ingredients Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-sm font-semibold text-primary">
                  Essential Ingredients ★
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => {
                    const essentialIndices = ingredients
                      .map((ing, idx) => ({ ing, idx }))
                      .filter(({ ing }) => ing.required)
                      .map(({ idx }) => idx);
                    
                    const allSelected = essentialIndices.every(idx =>
                      checkedIngredients.has(idx)
                    );
                    
                    const newChecked = new Set(checkedIngredients);
                    essentialIndices.forEach(idx => {
                      if (allSelected) {
                        newChecked.delete(idx);
                      } else {
                        newChecked.add(idx);
                      }
                    });
                    setCheckedIngredients(newChecked);
                  }}
                >
                  {ingredients
                    .map((ing, idx) => ({ ing, idx }))
                    .filter(({ ing }) => ing.required)
                    .every(({ idx }) => checkedIngredients.has(idx))
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
              <ul className="space-y-3">
                {ingredients
                  .map((ing, idx) => ({ ing, idx }))
                  .filter(({ ing }) => ing.required)
                  .map(({ ing, idx }) => (
                    <li
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-start gap-3 pb-3 border-b border-primary/20 last:border-0 last:pb-0 hover:bg-primary/5 -mx-2 px-2 py-1 rounded transition-all cursor-pointer ${
                        checkedIngredients.has(idx) ? "opacity-60" : ""
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          checkedIngredients.has(idx)
                            ? "bg-primary border-primary"
                            : "border-primary bg-primary/10 hover:border-primary/80"
                        }`}
                      >
                        {checkedIngredients.has(idx) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div
                        className={checkedIngredients.has(idx) ? "line-through text-muted-foreground" : ""}
                      >
                        <div className="font-semibold">
                          {(parseFloat(ing.amount as any) * (servings / recipe.servings)).toFixed(2)} {ing.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ing.name}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Optional Ingredients Section */}
            {ingredients.some((ing) => !ing.required) && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                  Optional
                </h3>
                <ul className="space-y-3">
                  {ingredients
                    .map((ing, idx) => ({ ing, idx }))
                    .filter(({ ing }) => !ing.required)
                    .map(({ ing, idx }) => (
                      <li
                        key={idx}
                        onClick={() => toggleIngredient(idx)}
                        className={`flex items-start gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0 hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-all cursor-pointer ${
                          checkedIngredients.has(idx) ? "opacity-60" : ""
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            checkedIngredients.has(idx)
                              ? "bg-primary border-primary"
                              : "border-border/50 bg-transparent hover:border-border"
                          }`}
                        >
                          {checkedIngredients.has(idx) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <div
                          className={checkedIngredients.has(idx) ? "line-through text-muted-foreground" : ""}
                        >
                          <div className="font-medium text-sm">
                            {(parseFloat(ing.amount as any) * (servings / recipe.servings)).toFixed(2)} {ing.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ing.name}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Instructions */}
          <Card className="p-6 md:col-span-2 bg-card/50 border-border/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              Instructions
            </h2>
            <ol className="space-y-4">
              {instructions.map((instruction, idx) => (
                <li
                  key={idx}
                  className="flex gap-4 group"
                >
                  <div className="shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <span className="text-sm font-bold text-primary">
                        {idx + 1}
                      </span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="text-base leading-relaxed text-foreground/90">
                      {instruction}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Start Cooking Button */}
        <div className="my-12 flex gap-3">
          {onBack && (
            <Button onClick={onBack} variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <Button 
            onClick={() => navigate(`/cook/${id}`)}
            size="lg"
            className="flex-1 gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Flame className="h-5 w-5" />
            Start Cooking
          </Button>
        </div>
      </div>
    </div>
  );
}
