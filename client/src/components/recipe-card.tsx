import { Clock, Users, Star, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const rating = parseFloat(recipe.rating as unknown as string);
  const ingredients = (recipe.ingredients as Array<{
    name: string;
    amount: string | number;
    unit: string;
    required?: boolean;
  }>) || [];
  const requiredIngredients = ingredients.filter((ing) => ing.required).length;

  // Local override mapping for images the user uploads into `client/public/assets/`
  // Place your uploaded image at: client/public/assets/creamymushroom.jpg
  // Key is the recipe title (exact match).
  const LOCAL_IMAGE_OVERRIDES: Record<string, string> = {
    "Creamy Mushroom Risotto": "data:image/jpeg;base64,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"
  };

  const imageSrc = LOCAL_IMAGE_OVERRIDES[recipe.title] || recipe.imageUrl || "/opengraph.jpg";

  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card border border-border/50 hover:border-primary/50 h-full flex flex-col"
    >
      {/* Image Container (shows dish image; fallback if missing) */}
      <div className="relative h-56 w-full overflow-hidden bg-muted shrink-0">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={recipe.title}
              loading="lazy"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/opengraph.jpg"; }}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
            <div className="text-center px-2">
              <h4 className="text-2xl md:text-3xl font-extrabold text-foreground/90 leading-tight line-clamp-2">
                {recipe.title}
              </h4>
            </div>
          </div>
        )}

        {/* Badge Overlay */}
        <div className="absolute top-3 left-3 right-3 flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground font-semibold">
            {recipe.cuisine}
          </Badge>
          <Badge variant="outline" className="bg-background/85 backdrop-blur-sm border-border/50">
            {recipe.dietType}
          </Badge>
        </div>

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-yellow-500/95 text-white px-2.5 py-1.5 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg">
            <Star className="h-3.5 w-3.5 fill-current" />
            {rating.toFixed(1)}
          </div>
        )}

        {/* View indicator on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
            <ArrowRight className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Content - Expanded */}
      <div className="p-4 grow flex flex-col">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 grow">
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {/* Required Ingredients Badge */}
        {requiredIngredients > 0 && (
          <div className="mb-3 p-2 bg-primary/10 rounded border border-primary/20">
            <div className="text-xs font-semibold text-primary">
              ★ {requiredIngredients} Essential Ingredients
            </div>
          </div>
        )}

        {/* Tags */}
        {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {(recipe.tags as string[]).slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-muted/50 border-border/50"
              >
                {tag}
              </Badge>
            ))}
            {(recipe.tags as string[]).length > 2 && (
              <Badge variant="outline" className="text-xs bg-muted/50 border-border/50">
                +{(recipe.tags as string[]).length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
