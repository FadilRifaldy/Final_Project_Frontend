import { Skeleton } from "@/components/ui/skeleton";

// loading skeleton
export function ProductDetailSkeleton() {
    // Konstanta untuk jumlah thumbnail images
    const THUMBNAIL_COUNT = 5;

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb Skeleton */}
            <div className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-3">
                    <Skeleton className="h-5 w-64" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Image Gallery Skeleton */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <Skeleton className="w-full aspect-square rounded-lg" />

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-5 gap-2">
                            {[...Array(THUMBNAIL_COUNT)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Product Info Skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-6 w-24" />        {/* Category Badge */}
                        <Skeleton className="h-10 w-3/4" />      {/* Product Name */}
                        <Skeleton className="h-8 w-32" />        {/* Price */}
                        <Skeleton className="h-24 w-full" />     {/* Variant Selector */}
                        <Skeleton className="h-20 w-full" />     {/* Stock Info */}
                        <Skeleton className="h-12 w-full" />     {/* Quantity Selector */}
                        <Skeleton className="h-12 w-full" />     {/* Add to Cart Button */}
                    </div>
                </div>
            </div>
        </div>
    );
}
