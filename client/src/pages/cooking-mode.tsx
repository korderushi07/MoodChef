import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  CheckCircle2,
  X,
} from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    required: boolean;
  }>;
  instructions: string[];
  imageUrl: string;
  rating: number;
}

export function CookingMode() {
  const [, params] = useRoute("/cook/:id");
  const recipeId = params?.id;

  const { data: recipe, isLoading } = useQuery({
    queryKey: [`/api/recipes/${recipeId}`],
    queryFn: async () => {
      const res = await fetch(`/api/recipes/${recipeId}`);
      return res.json() as Promise<Recipe>;
    },
    enabled: !!recipeId,
  });

  const [showIngredientConfirm, setShowIngredientConfirm] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState<
    Set<string>
  >(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const totalTime =
    (recipe?.prepTime || 0) + (recipe?.cookTime || 0);
  const totalSteps = recipe?.instructions.length || 0;
  const progressPercent =
    totalSteps > 0
      ? ((completedSteps.size + (currentStep > 0 ? 1 : 0)) / totalSteps) * 100
      : 0;

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartCooking = () => {
    if (selectedIngredients.size === recipe?.ingredients.length) {
      setShowIngredientConfirm(false);
      setIsTimerRunning(true);
      setCurrentStep(0);
    }
  };

  const handleCompleteStep = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTimerRunning(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const toggleIngredient = (name: string) => {
    const updated = new Set(selectedIngredients);
    if (updated.has(name)) {
      updated.delete(name);
    } else {
      updated.add(name);
    }
    setSelectedIngredients(updated);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading recipe...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Recipe not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Ingredient Confirmation Dialog */}
      <Dialog open={showIngredientConfirm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Confirm Your Ingredients
            </DialogTitle>
            <DialogDescription>
              Check off all ingredients before starting. This ensures you have
              everything ready.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
              {recipe.ingredients.map((ingredient) => (
                <div key={ingredient.name} className="flex items-center gap-3">
                  <Checkbox
                    id={ingredient.name}
                    checked={selectedIngredients.has(ingredient.name)}
                    onCheckedChange={() => toggleIngredient(ingredient.name)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={ingredient.name}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleStartCooking}
                disabled={selectedIngredients.size !== recipe.ingredients.length}
                className="flex-1 gap-2"
              >
                <Flame className="h-4 w-4" />
                Start Cooking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Cooking Interface */}
      {!showIngredientConfirm && (
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">{recipe.title}</h1>
            <p className="mt-2 text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>

          {/* Timer and Progress Card */}
          <Card className="mb-8 border-border/50 bg-linear-to-br from-card via-card to-primary/5 p-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Timer */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-background/50 p-8">
                <div className="text-6xl font-bold font-mono text-primary">
                  {formatTime(elapsed)}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Est. total: {formatTime(totalTime * 60)}
                </p>
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  variant="outline"
                  className="mt-4 gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {isTimerRunning ? "Pause" : "Resume"}
                </Button>
              </div>

              {/* Progress */}
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {completedSteps.size + (currentStep > 0 ? 1 : 0)}/{totalSteps}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>

                <div className="space-y-2">
                  {recipe.instructions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-sm p-2 rounded ${
                        completedSteps.has(idx)
                          ? "text-muted-foreground line-through"
                          : idx === currentStep
                          ? "text-primary font-medium bg-primary/10"
                          : "text-muted-foreground"
                      }`}
                    >
                      {completedSteps.has(idx) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-current" />
                      )}
                      <span className="text-xs">Step {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Current Step */}
          <Card className="mb-8 border-border/50 bg-card/50 p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Step {currentStep + 1}: {recipe.instructions[currentStep]}
                </h2>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex gap-3">
              <Button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                variant="outline"
                className="gap-2"
              >
                <ChevronUp className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleCompleteStep}
                className="flex-1 gap-2 bg-linear-to-r from-primary to-primary/80"
              >
                <CheckCircle2 className="h-4 w-4" />
                {currentStep === totalSteps - 1
                  ? "Finish Cooking"
                  : "Next Step"}
              </Button>

              <Button
                onClick={handleNextStep}
                disabled={currentStep === totalSteps - 1}
                variant="outline"
                className="gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                Skip
              </Button>
            </div>
          </Card>

          {/* All Steps Overview */}
          <Card className="border-border/50 bg-card/30 p-6">
            <h3 className="mb-4 font-semibold">All Steps</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recipe.instructions.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => !completedSteps.has(idx) && setCurrentStep(idx)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    idx === currentStep
                      ? "border-primary bg-primary/10"
                      : completedSteps.has(idx)
                      ? "border-border/30 bg-muted/30 text-muted-foreground"
                      : "border-border/50 hover:bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {completedSteps.has(idx) ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">Step {idx + 1}</p>
                      <p className="text-xs text-muted-foreground">{step}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Completion Message */}
          {completedSteps.size === totalSteps && (
            <div className="mt-8 rounded-2xl border-2 border-green-500/30 bg-green-500/5 p-8 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold">Cooking Complete!</h2>
              <p className="mt-2 text-muted-foreground">
                You finished in {formatTime(elapsed)}. Enjoy your meal!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
