// components/ProductCardMock.tsx

import { Button } from "@/components/ui/button";
import Image from "next/image";

type DummyProduct = {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  unit: string;
  image: string;
  discount?: number;
};

export function ProductCardMock({ product }: { product: DummyProduct }) {
  return (
    <div className="group relative rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <span className="inline-block bg-muted px-2 py-1 rounded-full text-[10px] text-muted-foreground">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-display font-semibold text-foreground line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div>
          <span className="font-bold text-lg">{product.price}</span>
          <div className="text-xs text-muted-foreground">{product.unit}</div>
        </div>

        {/* Button */}
        <Button className="w-full">Add to Cart</Button>
      </div>
    </div>
  );
}
