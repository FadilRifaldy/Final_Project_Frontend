"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { IProduct, IProductVariant } from "@/types/product";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  // Get first image or use placeholder
  const primaryImage = product.images?.[0]?.imageUrl || "/placeholder-product.jpg";

  // Get the specific variant displayed (filtered by store from parent)
  const displayedVariant = product.variants?.[0];

  // Get price from first variant
  const displayPrice = displayedVariant?.price
    ? Number(displayedVariant.price)
    : 0;

  // Generate product detail URL using product name as slug
  const productSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") 
    .replace(/^-+|-+$/g, ""); 

  // Add variant slug to URL if available
  const detailUrl = `/browse/${productSlug}${displayedVariant?.slug ? `?variant=${displayedVariant.slug}` : ""}`;

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

          {/* Product Name - Show Variant Name if available (filtered), otherwise Product Name */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-10">
            {displayedVariant ? displayedVariant.name : product.name}
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

          {/* button Lihat Detail */}
          <Button
            className="cursor-pointer w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition shadow-sm"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Lihat Detail
          </Button>
        </div>

      </div>
    </Link>
  );
}
