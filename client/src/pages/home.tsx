import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChefHat,
  Dices,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type MoodKey =
  | "cozy"
  | "energized"
  | "fresh"
  | "comfort"
  | "adventurous"
  | "quick";

type Recipe = {
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

const RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Miso Butter Noodles",
    mood: "comfort",
    time: "15 min",
    tags: ["savory", "umami", "pantry"],
  },
  {
    id: "r2",
    title: "Lemony Chickpea Salad",
    mood: "fresh",
    time: "12 min",
    tags: ["no-cook", "crunchy", "bright"],
  },
  {
    id: "r3",
    title: "One-Pot Cozy Lentil Stew",
    mood: "cozy",
    time: "45 min",
    tags: ["hearty", "make-ahead", "cozy"],
  },
  {
    id: "r4",
    title: "Spicy Gochujang Chicken Bowl",
    mood: "energized",
    time: "25 min",
    tags: ["spicy", "protein", "weeknight"],
  },
  {
    id: "r5",
    title: "Crispy Tofu Tacos w/ Slaw",
    mood: "adventurous",
    time: "30 min",
    tags: ["crunchy", "street-style", "zesty"],
  },
  {
    id: "r6",
    title: "Sheet-Pan Pesto Veg + Sausage",
    mood: "quick",
    time: "20 min",
    tags: ["sheet-pan", "minimal", "green"],
  },
  {
    id: "r7",
    title: "Paneer Tikka Masala",
    mood: "comfort",
    time: "35 min",
    tags: ["indian", "spicy", "creamy"],
  },
  {
    id: "r8",
    title: "Coconut Malabar Curry",
    mood: "cozy",
    time: "40 min",
    tags: ["indian", "coastal", "aromatic"],
  },
  {
    id: "r9",
    title: "Street-Style Pav Bhaji",
    mood: "adventurous",
    time: "30 min",
    tags: ["indian", "street-food", "buttery"],
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
        "hover:shadow-sm hover:translate-y-[-1px] active:translate-y-[0px]",
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
  const [activeMood, setActiveMood] = useState<MoodKey | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((r) => {
      const moodOk = activeMood === "all" ? true : r.mood === activeMood;
      const queryOk =
        q.length === 0
          ? true
          : [r.title, r.time, ...r.tags, r.mood].some((s) =>
              s.toLowerCase().includes(q),
            );
      return moodOk && queryOk;
    });
  }, [activeMood, query]);

  const randomPick = () => {
    const list = filtered.length ? filtered : RECIPES;
    const choice = list[Math.floor(Math.random() * list.length)];
    setQuery(choice.title);
    setActiveMood(choice.mood);
  };

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
                <Sparkles className="mr-1.5 size-3.5" /> Hackathon-ready skeleton
              </Badge>
              <Badge
                variant="outline"
                data-testid="badge-no-backend"
                className="rounded-full border-border/70 bg-transparent"
              >
                Frontend only
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
              Pick a vibe, scan a curated set of recipes, and build a quick shortlist.
              This is a clean UI foundation—no complex logic yet.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by dish, tag, or time…"
                  data-testid="input-search"
                  className="h-11 rounded-full border-border/70 bg-card/70 pl-4 pr-4 shadow-sm backdrop-blur focus-visible:ring-ring"
                />
              </div>
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
                  {filtered.length === 1 ? "" : "s"}
                </span>
              </div>
              <span aria-hidden className="hidden sm:inline">•</span>
              <div data-testid="text-hint">
                Tip: try “cozy” + “make-ahead” to plan ahead.
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
                  {filtered.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="group rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:border-primary/20 animate-in fade-in slide-in-from-bottom-2"
                      data-testid={`card-recipe-${r.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium leading-tight group-hover:text-primary transition-colors" data-testid={`text-recipe-title-${r.id}`}>
                            {r.title}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-recipe-time-${r.id}`}>
                            {r.time}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="rounded-full border border-border/70 bg-secondary/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                          data-testid={`badge-recipe-mood-${r.id}`}
                        >
                          {r.mood}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[11px] text-foreground/80 group-hover:border-primary/10 transition-colors"
                            data-testid={`tag-recipe-${r.id}-${t}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="py-10 text-center text-sm text-muted-foreground animate-in fade-in">
                      No matches for this mood and search combo.
                    </div>
                  )}
                </div>

              <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground" data-testid="panel-placeholder">
                Placeholder for future interactions: recipe details, filters, and a\n                “save shortlist” panel.
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
                A simple grid you can wire up to real data later.
              </p>
            </div>
            <Button
              variant="secondary"
              className="rounded-full"
              data-testid="button-clear-filters"
              onClick={() => {
                setActiveMood("all");
                setQuery("");
              }}
            >
              Clear
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <Card
                key={r.id}
                className="group mc-card border-border/70 bg-card/80 p-4 backdrop-blur transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:border-primary/30 animate-in fade-in zoom-in-95"
                data-testid={`card-explore-${r.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mc-serif text-lg font-semibold leading-tight group-hover:text-primary transition-colors" data-testid={`text-explore-title-${r.id}`}>
                      {r.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-explore-time-${r.id}`}>
                      {r.time}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-border/70 bg-secondary/60 group-hover:bg-primary/10 transition-colors"
                    data-testid={`badge-explore-mood-${r.id}`}
                  >
                    {r.mood}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-[11px] text-foreground/80"
                      data-testid={`tag-explore-${r.id}-${t}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button
                    variant="secondary"
                    className="rounded-full"
                    data-testid={`button-view-${r.id}`}
                    onClick={() => {
                      // Placeholder: open recipe modal
                    }}
                  >
                    View
                  </Button>
                  <Button
                    className="rounded-full"
                    data-testid={`button-save-${r.id}`}
                    onClick={() => {
                      // Placeholder: save to shortlist
                    }}
                  >
                    Save
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="about" className="mt-12 md:mt-16">
          <Card className="mc-card border-border/70 bg-card/80 p-6 backdrop-blur" data-testid="card-about">
            <div className="grid gap-4 md:grid-cols-[1fr_.9fr] md:items-center">
              <div>
                <h3 className="mc-serif text-2xl font-semibold" data-testid="text-about-title">
                  Built to iterate fast
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="text-about-body">
                  MoodChef is a UI-first prototype: a strong layout, responsive spacing, and clear\n                  components you can extend with real recipes, accounts, and saved lists later.\n                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground" data-testid="panel-about-placeholder">
                Placeholder for future: “Random dish” routing, recipe detail page, and\n                onboarding flow.
              </div>
            </div>
          </Card>
        </section>

        <footer className="mt-14 border-t border-border/70 pt-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div data-testid="text-footer-left">
              <span className="mc-serif font-semibold text-foreground">MoodChef</span> \u00b7 built for hackathon speed
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
