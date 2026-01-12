"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { IProduct, IProductVariant } from "@/types/product";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  // Get first image or use placeholder
  const primaryImage = product.images?.[0]?.imageUrl || "/placeholder-product.jpg";

  // Get cheapest price from variants
  const getLowestPrice = () => {
    if (!product.variants || product.variants.length === 0) {
      return 0;
    }
    const prices = product.variants.map((v: IProductVariant) => Number(v.price));
    return Math.min(...prices);
  };

  const lowestPrice = getLowestPrice();

  // Generate product detail URL using product name as slug
  // Example: "iPhone 17 Pro" -> "iphone-17-pro"
  const productSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes

  const detailUrl = `/browse/${productSlug}`;

  return (
    <Link href={detailUrl}>
      <div className="group relative rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category Badge */}
          {product.category && (
            <Badge variant="secondary" className="text-[10px]">
              {product.category.name}
            </Badge>
          )}

          {/* Product Name */}
          <h3 className="font-display font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div>
            <span className="font-bold text-lg text-primary">
              {product.variants && product.variants.length > 1 && (
                <span className="text-xs font-normal text-muted-foreground mr-1">
                  Mulai dari
                </span>
              )}
              Rp {lowestPrice.toLocaleString("id-ID")}
            </span>
            {product.variants && product.variants.length > 1 && (
              <div className="text-xs text-muted-foreground">
                {product.variants.length} varian
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              // TODO: Implement add to cart
              alert("Feature to be added");
            }}
          >
            Lihat Detail
          </Button>
        </div>
      </div>
    </Link>
  );
}
