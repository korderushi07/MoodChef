import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export interface RecipeFilters {
  search: string;
  cuisine: string;
  dietType: string;
  maxTime: number | undefined;
}

interface RecipeFiltersProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
}

const CUISINES = [
  "All",
  "Italian",
  "Asian",
  "Mexican",
  "Indian",
  "American",
  "Mediterranean",
  "Thai",
  "French",
  "Japanese",
  "Middle Eastern",
];

const DIET_TYPES = [
  "All",
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Regular",
];

const TIME_OPTIONS = [
  { label: "Any", value: undefined },
  { label: "Under 15 min", value: 15 },
  { label: "Under 30 min", value: 30 },
  { label: "Under 60 min", value: 60 },
  { label: "Under 120 min", value: 120 },
];

export function RecipeFilters({ filters, onFiltersChange }: RecipeFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleCuisineChange = (value: string) => {
    onFiltersChange({
      ...filters,
      cuisine: value === "All" ? "" : value,
    });
  };

  const handleDietChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dietType: value === "All" ? "" : value,
    });
  };

  const handleTimeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      maxTime: value === "undefined" ? undefined : parseInt(value),
    });
  };

  const activeFilterCount = [
    filters.search,
    filters.cuisine,
    filters.dietType,
    filters.maxTime,
  ].filter(Boolean).length;

  const handleReset = () => {
    onFiltersChange({
      search: "",
      cuisine: "",
      dietType: "",
      maxTime: undefined,
    });
  };

  return (
    <Card className="p-4 mb-6 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount}</Badge>
          )}
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium block mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              {filters.search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cuisine */}
          <div>
            <label className="text-sm font-medium block mb-2">Cuisine</label>
            <Select
              value={filters.cuisine || "All"}
              onValueChange={handleCuisineChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUISINES.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Diet Type */}
          <div>
            <label className="text-sm font-medium block mb-2">Diet Type</label>
            <Select
              value={filters.dietType || "All"}
              onValueChange={handleDietChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIET_TYPES.map((diet) => (
                  <SelectItem key={diet} value={diet}>
                    {diet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cooking Time */}
          <div>
            <label className="text-sm font-medium block mb-2">Time to Cook</label>
            <Select
              value={
                filters.maxTime !== undefined
                  ? filters.maxTime.toString()
                  : "undefined"
              }
              onValueChange={handleTimeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.label}
                    value={
                      option.value !== undefined
                        ? option.value.toString()
                        : "undefined"
                    }
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
