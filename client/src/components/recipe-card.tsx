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
    // Map recipe titles to images in client/public
  const TITLE_TO_IMAGE: Record<string, string> = {
    "Butter Chicken": "/butter-chicken.jpg",
    "Crispy Aloo Tikki Chaat": "/crispy-aloo-tikki-chaat.jpg",
    "Masala Dosa": "/masala-dosa.jpg",
    "Chole Bhature": "/chole-bhature.jpg",
    "Pani Puri": "/pani-puri.webp",
    "Tandoor Chicken": "/tandoor-chicken.jpg",
  };
  
    const imageSrc =
  TITLE_TO_IMAGE[recipe.title] ||
  (typeof recipe.imageUrl === "string" && recipe.imageUrl.startsWith("/")
    ? recipe.imageUrl
    : null) ||
  "/butter-chicken.jpg";



  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card border border-border/50 hover:border-primary/50 flex flex-col"

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
