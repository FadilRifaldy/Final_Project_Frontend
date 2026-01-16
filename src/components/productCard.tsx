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

  // Get price from first variant
  const displayPrice = product.variants?.[0]?.price
    ? Number(product.variants[0].price)
    : 0;

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
        <div className="p-3 space-y-2">
          {/* Category Badge */}
          {product.category && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              {product.category.name}
            </Badge>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-10">
            {product.name}
          </h3>

          {/* Price & Variant Info */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-base text-primary">
              Rp {displayPrice.toLocaleString("id-ID")}
            </span>
            {product.variants && product.variants.length > 1 && (
              <span className="text-[10px] text-muted-foreground">
                {product.variants.length} varian
              </span>
            )}
          </div>

          {/* button add to category */}
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              // TODO: Implement add to cart
              alert("Feature to be added");
            }}
          >
            Add to cart
          </Button>
        </div>

      </div>
    </Link>
  );
}
