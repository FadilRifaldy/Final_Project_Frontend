"use client";

import { cn } from "@/lib/utils";

const categories = [
  { name: "Fruits" },
  { name: "Vegetables" },
  { name: "Dairy & Eggs" },
  { name: "Meat" },
  { name: "Seafood" },
  { name: "Bakery" },
];

export function CategorySection() {
  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-2">
            Browse through our wide selection of fresh groceries
          </p>
        </div>

        {/* Category Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 place-items-center"

        >
          {categories.map((cat, index) => (
            <a
              key={cat.name}
              href="#products"
              className={cn(
                "w-full text-center p-3 md:p-4 h-14 flex items-center justify-center",
                "rounded-xl bg-card border border-border/40 shadow-sm",
                "hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="text-sm md:text-base font-medium text-foreground">
                {cat.name}
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
