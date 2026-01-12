"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    images: {
        id: string;
        imageUrl: string;
        order: number;
    }[];
    productName: string;
}

export function ProductImageGallery({
    images,
    productName,
}: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
            </div>
        );
    }

    const sortedImages = [...images].sort((a, b) => a.order - b.order);
    const currentImage = sortedImages[selectedIndex];

    const handlePrevious = () => {
        setSelectedIndex((prev) =>
            prev === 0 ? sortedImages.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setSelectedIndex((prev) =>
            prev === sortedImages.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden group">
                <Image
                    src={currentImage.imageUrl}
                    alt={`${productName} - Image ${selectedIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={selectedIndex === 0}
                />

                {/* Navigation Arrows - only show if multiple images */}
                {sortedImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {sortedImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {selectedIndex + 1} / {sortedImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Grid - only show if multiple images */}
            {sortedImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {sortedImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                                selectedIndex === index
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent hover:border-muted-foreground/30"
                            )}
                        >
                            <Image
                                src={image.imageUrl}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="20vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
