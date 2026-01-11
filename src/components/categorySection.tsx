"use client";

import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

export function CategorySection() {
  const { categories, isLoading, error, refetch } = useCategories();
  const [showAll, setShowAll] = useState(false);

  // Randomize and limit categories for initial display
  const displayedCategories = useMemo(() => {
    if (categories.length === 0) return [];

    // Shuffle categories
    const shuffled = [...categories].sort(() => Math.random() - 0.5);

    // Show 12 random categories initially, all if expanded
    return showAll ? shuffled : shuffled.slice(0, 12);
  }, [categories, showAll]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-2">
            Browse through our wide selection of fresh groceries
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="shrink-0 w-32 h-12 rounded-xl bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        )}

        {/* Category Single Row */}
        {!isLoading && !error && displayedCategories.length > 0 && (
          <>
            <div className="relative">
              {/* Left Fade */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background via-background/50 to-transparent z-10 pointer-events-none" />
              {/* Right Fade */}
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background via-background/50 to-transparent z-10 pointer-events-none" />

              <div className="flex gap-3 overflow-x-auto scrollbar-hide p-2">
                {displayedCategories.map((category, index) => (
                  <Link
                    key={category.id}
                    href="#products"
                    className={cn(
                      "shrink-0 px-6 py-3 h-12 flex items-center justify-center",
                      "rounded-xl bg-amber-500 shadow-sm",
                      "hover:shadow-md hover:bg-amber-600 hover:-translate-y-1 transition-all",
                      "animate-fade-in whitespace-nowrap"
                    )}
                    style={{ animationDelay: `${index * 40}ms` }}
                    title={category.description || category.name}
                  >
                    <span className="text-sm md:text-base font-medium text-white">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>


          </>
        )}

      </div>
    </section>
  );
}
