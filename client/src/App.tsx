import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import RecipeExplorer from "./pages/recipe-explorer";
import RecipeDetailPage from "./pages/recipe-detail";
import { CookingMode } from "./pages/cooking-mode";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explorer" component={RecipeExplorer} />
      <Route path="/recipe/:id" component={RecipeDetailPage} />
      <Route path="/cook/:id" component={CookingMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
