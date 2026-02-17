import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import {
  ArrowRight,
  ChefHat,
  Dices,
  Sparkles,
  UtensilsCrossed,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecipeCard } from "@/components/recipe-card";
import { type Recipe } from "@shared/schema";
import RecipeDetailPage from "@/pages/recipe-detail";

type MoodKey =
  | "cozy"
  | "energized"
  | "fresh"
  | "comfort"
  | "adventurous"
  | "quick";

type LegacyRecipe = {
  id: string;
  title: string;
  mood: MoodKey;
  time: string;
  tags: string[];
};

const MOODS: Array<{
  key: MoodKey;
  label: string;
  description: string;
  accent: "primary" | "secondary" | "accent";
}> = [
  {
    key: "cozy",
    label: "Cozy",
    description: "Warm bowls, slow simmer, soft spices.",
    accent: "secondary",
  },
  {
    key: "comfort",
    label: "Comfort",
    description: "Carby classics and nostalgic favorites.",
    accent: "primary",
  },
  {
    key: "fresh",
    label: "Fresh",
    description: "Bright, crunchy, citrusy, herb-forward.",
    accent: "accent",
  },
  {
    key: "energized",
    label: "Energized",
    description: "High-protein, high-flavor, fast prep.",
    accent: "primary",
  },
  {
    key: "adventurous",
    label: "Adventurous",
    description: "New cuisines, bold heat, surprise combos.",
    accent: "secondary",
  },
  {
    key: "quick",
    label: "Quick",
    description: "10–20 minute wins (minimal cleanup).",
    accent: "accent",
  },
];

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function MoodPill({
  label,
  selected,
  onClick,
  testId,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition",
        "border bg-card/70 backdrop-blur",
        "hover:shadow-sm hover:-translate-y-px active:translate-y-0",
        selected
          ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
          : "border-border text-foreground/80",
      )}
    >
      <span className="pointer-events-none">{label}</span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset transition",
          selected ? "ring-primary/20" : "ring-transparent group-hover:ring-border",
        )}
      />
    </button>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [activeMood, setActiveMood] = useState<MoodKey | "all">("all");
  const [query, setQuery] = useState("");
  const [maxCookingTime, setMaxCookingTime] = useState<number | undefined>(undefined);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Fetch recipes on mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (!response.ok) throw new Error("Failed to fetch recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search and cooking time
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      const queryOk =
        q.length === 0
          ? true
          : [r.title, r.description, r.cuisine, r.dietType]
              .filter((s) => s != null)
              .some((s) => String(s).toLowerCase().includes(q));
      
      // Calculate total cooking time
      const totalTime = r.prepTime + r.cookTime;
      const timeOk = maxCookingTime === undefined ? true : totalTime <= maxCookingTime;
      
      return queryOk && timeOk;
    });
  }, [recipes, query, maxCookingTime]);

  const randomPick = () => {
    const list = filtered.length ? filtered : recipes;
    if (list.length === 0) return;
    const choice = list[Math.floor(Math.random() * list.length)];
    setSelectedRecipe(choice);
  };

  // Preload images for smoother UI (improves perceived load time)
  useEffect(() => {
    if (!recipes || recipes.length === 0) return;
    const urls = recipes.map((r) => r.imageUrl).filter(Boolean) as string[];
    urls.forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  }, [recipes]);

  if (selectedRecipe) {
    return (
      <RecipeDetailPage
        recipeId={selectedRecipe.id}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="min-h-dvh mc-gradient">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/55 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div
              className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm"
              data-testid="img-logo"
            >
              <ChefHat className="size-5" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div
                className="mc-serif text-lg font-semibold tracking-tight"
                data-testid="text-app-title"
              >
                MoodChef
              </div>
              <div className="text-xs text-muted-foreground" data-testid="text-app-tagline">
                Mood-based recipe discovery
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <a
              href="#explore"
              data-testid="link-explore"
              className="rounded-full px-3 py-2 text-sm text-foreground/80 transition hover:bg-card/70 hover:text-foreground"
            >
              Explore
            </a>
            <button
              type="button"
              data-testid="button-random-dish"
              onClick={randomPick}
              className="rounded-full px-3 py-2 text-sm text-foreground/80 transition hover:bg-card/70 hover:text-foreground"
            >
              Random Dish
            </button>
            <a
              href="#about"
              data-testid="link-about"
              className="rounded-full px-3 py-2 text-sm text-foreground/80 transition hover:bg-card/70 hover:text-foreground"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="hidden rounded-full md:inline-flex"
              data-testid="button-open-app"
              asChild
            >
              <Link href="#explore">Open</Link>
            </Button>
            <Button
              className="rounded-full"
              data-testid="button-get-started"
              asChild
            >
              <Link href="#explore">
                Get started <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
        <section className="grid items-start gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                data-testid="badge-hackathon-ready"
                className="rounded-full border border-border/70 bg-card/70 backdrop-blur"
              >
                <Sparkles className="mr-1.5 size-3.5" /> AI Customize
              </Badge>
              <Badge
                variant="outline"
                data-testid="badge-no-backend"
                className="rounded-full border-border/70 bg-transparent"
              >
                Fresh recipes!!
              </Badge>
            </div>

            <h1
              className="mt-5 mc-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
              data-testid="text-hero-headline"
            >
              Tell me your mood.
              <span className="block text-foreground/80">I’ll tell you what to cook.</span>
            </h1>

            <p
              className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
              data-testid="text-hero-subtitle"
            >
              Explore delicious recipes by cuisine, dietary preference, and cooking time. Build your perfect meal plan with interactive ingredient checklists.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by dish, cuisine, or diet…"
                  data-testid="input-search"
                  className="h-11 rounded-full border-border/70 bg-card/70 pl-4 pr-4 shadow-sm backdrop-blur focus-visible:ring-ring"
                />
              </div>
              
              <Select 
                value={maxCookingTime ? maxCookingTime.toString() : "all"}
                onValueChange={(value) => setMaxCookingTime(value === "all" ? undefined : parseInt(value))}
              >
                <SelectTrigger className="h-11 w-40 rounded-full border-border/70 bg-card/70 shadow-sm backdrop-blur">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Cooking time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any time</SelectItem>
                  <SelectItem value="15">Under 15 min</SelectItem>
                  <SelectItem value="30">Under 30 min</SelectItem>
                  <SelectItem value="45">Under 45 min</SelectItem>
                  <SelectItem value="60">Under 60 min</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="lg"
                className="h-11 rounded-full"
                data-testid="button-randomize"
                onClick={randomPick}
              >
                <Dices className="mr-2 size-4" /> Randomize
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2" data-testid="section-mood-pills">
              <MoodPill
                label="All"
                selected={activeMood === "all"}
                onClick={() => setActiveMood("all")}
                testId="button-mood-all"
              />
              {MOODS.map((m) => (
                <MoodPill
                  key={m.key}
                  label={m.label}
                  selected={activeMood === m.key}
                  onClick={() => setActiveMood(m.key)}
                  testId={`button-mood-${m.key}`}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2" data-testid="status-recipe-count">
                <UtensilsCrossed className="size-4" />
                <span>
                  Showing <span className="font-medium text-foreground">{filtered.length}</span> recipe
                  {filtered.length === 1 ? "" : "s"} out of {recipes.length}
                </span>
              </div>
              {maxCookingTime && (
                <>
                  <span aria-hidden>•</span>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Clock className="size-4" />
                    <span>Under {maxCookingTime} min</span>
                  </div>
                </>
              )}
              <span aria-hidden className="hidden sm:inline">•</span>
              <div data-testid="text-hint">
                Tip: use the filters to find your perfect recipe.
              </div>
            </div>
          </div>

          <aside className="md:pt-2">
            <Card className="mc-card mc-glass border-border/70 p-4 md:p-5" data-testid="card-hero-preview">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground" data-testid="text-preview-label">
                    Today’s vibe
                  </div>
                  <div className="mt-1 mc-serif text-2xl font-semibold" data-testid="text-preview-mood">
                    {activeMood === "all" ? "Anything" : MOODS.find((m) => m.key === activeMood)?.label}
                  </div>
                </div>
                <div
                  className="grid size-12 place-items-center rounded-2xl bg-secondary/70 text-foreground shadow-sm"
                  data-testid="img-preview-icon"
                >
                  <Sparkles className="size-5" strokeWidth={2.2} />
                </div>
              </div>

              <div className="mt-4 grid gap-3 transition-all duration-500">
                {filtered.slice(0, 1).map((r) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    onClick={() => setSelectedRecipe(r)}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground animate-in fade-in">
                    No matches for your search.
                  </div>
                )}
              </div>

            </Card>
          </aside>
        </section>

        <section id="explore" className="mt-10 md:mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="mc-serif text-2xl font-semibold tracking-tight" data-testid="text-explore-title">
                Explore recipes
              </h2>
              <p className="mt-1 text-sm text-muted-foreground" data-testid="text-explore-subtitle">
                Discover delicious recipes with beautiful images and essential ingredients.
              </p>
            </div>
            <Button
              variant="secondary"
              className="rounded-full"
              data-testid="button-clear-filters"
              onClick={() => {
                setQuery("");
                setMaxCookingTime(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>

          {loading ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-96 animate-pulse bg-muted" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 text-center py-12">
              <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search</p>
              <Button onClick={() => setQuery("")} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-14 border-t border-border/70 pt-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div data-testid="text-footer-left">
  <span className="mc-serif font-semibold text-foreground">MoodChef</span>
<span className="ml-2 text-muted-foreground">
  <span className="inline-block animate-pulse text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]">
  ❤️
</span>{" "}
   Cooked in Code n Cravings - Nehal Mehta & Rushikesh Korde
</span>

</div>


            <div className="flex items-center gap-3" data-testid="section-footer-links">
              <a
                href="#explore"
                className="transition hover:text-foreground"
                data-testid="link-footer-explore"
              >
                Explore
              </a>
              <a
                href="#about"
                className="transition hover:text-foreground"
                data-testid="link-footer-about"
              >
                About
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
