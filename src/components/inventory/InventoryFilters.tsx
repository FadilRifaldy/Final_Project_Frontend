'use client'

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface FilterState {
    search: string;
    categoryId: string;
    stockStatus: string;
    sortBy: string;
}

interface InventoryFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    categories: Category[];
}

export default function InventoryFilters({
    onFilterChange,
    categories
}: InventoryFiltersProps) {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [stockStatus, setStockStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name-asc');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilterChange();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Trigger filter change for non-search filters
    useEffect(() => {
        handleFilterChange();
    }, [categoryId, stockStatus, sortBy]);

    const handleFilterChange = () => {
        onFilterChange({
            search,
            categoryId,
            stockStatus,
            sortBy
        });
    };

    const clearFilters = () => {
        setSearch('');
        setCategoryId('all');
        setStockStatus('all');
        setSortBy('name-asc');
    };

    // Count active filters
    const activeFilterCount = [
        search !== '',
        categoryId !== 'all',
        stockStatus !== 'all',
        sortBy !== 'name-asc'
    ].filter(Boolean).length;

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card hover:shadow-lg transition-shadow">
            {/* Search Input */}
            <div className="space-y-2">
                <Label htmlFor="search" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search Products
                </Label>
                <Input
                    id="search"
                    placeholder="Search by product, variant, or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Stock Status Filter */}
                <div className="space-y-2">
                    <Label htmlFor="stock-status">Stock Status</Label>
                    <Select value={stockStatus} onValueChange={setStockStatus}>
                        <SelectTrigger id="stock-status">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock (≤10)</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                    <Label htmlFor="sort-by">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger id="sort-by">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                            <SelectItem value="stock-high">Stock (High to Low)</SelectItem>
                            <SelectItem value="stock-low">Stock (Low to High)</SelectItem>
                            <SelectItem value="updated">Recently Updated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {activeFilterCount > 0 ? (
                            <>
                                <Badge variant="secondary" className="mr-2">
                                    {activeFilterCount}
                                </Badge>
                                active filter{activeFilterCount > 1 ? 's' : ''}
                            </>
                        ) : (
                            'No active filters'
                        )}
                    </span>
                </div>
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}
