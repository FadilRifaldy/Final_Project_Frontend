"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api/axios";

interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    price: number;
    product: {
        id: string;
        name: string;
    };
}

interface VariantAutocompleteProps {
    selectedIds: string[];
    onSelect: (variantIds: string[]) => void;
    placeholder?: string;
}

export function VariantAutocomplete({
    selectedIds,
    onSelect,
    placeholder = "Search products or SKU...",
}: VariantAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<ProductVariant[]>([]);
    const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search variants
    useEffect(() => {
        const searchVariants = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await api.get("/api/products/variants/search", {
                    params: { q: query, limit: 10 },
                });
                setResults(response.data.data || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Error searching variants:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(searchVariants, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelect = (variant: ProductVariant) => {
        if (!selectedIds.includes(variant.id)) {
            const newSelected = [...selectedVariants, variant];
            setSelectedVariants(newSelected);
            onSelect([...selectedIds, variant.id]);
        }
        setQuery("");
        setIsOpen(false);
    };

    const handleRemove = (variantId: string) => {
        const newSelected = selectedVariants.filter((v) => v.id !== variantId);
        setSelectedVariants(newSelected);
        onSelect(newSelected.map((v) => v.id));
    };

    return (
        <div className="space-y-3">
            {/* Search Input */}
            <div ref={wrapperRef} className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setIsOpen(true)}
                        placeholder={placeholder}
                        className="pl-9"
                    />
                    {isLoading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                </div>

                {/* Dropdown Results */}
                {isOpen && results.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                        {results.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => handleSelect(variant)}
                                disabled={selectedIds.includes(variant.id)}
                                className={cn(
                                    "w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-0",
                                    selectedIds.includes(variant.id) && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <div className="font-medium text-sm">{variant.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {variant.product.name} • SKU: {variant.sku} • Rp {Number(variant.price).toLocaleString("id-ID")}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {isOpen && query.length >= 2 && !isLoading && results.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
                        No variants found
                    </div>
                )}
            </div>

            {/* Selected Variants */}
            {selectedVariants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedVariants.map((variant) => (
                        <Badge key={variant.id} variant="secondary" className="pl-3 pr-1 py-1">
                            <span className="text-xs">{variant.name}</span>
                            <button
                                onClick={() => handleRemove(variant.id)}
                                className="ml-2 hover:bg-muted rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
