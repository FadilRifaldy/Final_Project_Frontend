import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface AdvancedFiltersPopoverProps {
    filters: FilterState;
    categories: Category[];
    onFilterChange: (filters: FilterState) => void;
    activeCount: number;
}

export function AdvancedFiltersPopover({
    filters,
    categories,
    onFilterChange,
    activeCount
}: AdvancedFiltersPopoverProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);

    const handleClearAll = () => {
        onFilterChange({
            search: '',
            categoryId: 'all',
            stockStatus: 'all',
            sortBy: 'name-asc'
        });
    };

    const selectedCategory = categories.find(cat => cat.id === filters.categoryId);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    More Filters
                    {activeCount > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {activeCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    {/* Searchable Category Filter */}
                    <div>
                        <Label>Category</Label>
                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={categoryOpen}
                                    className="w-full justify-between mt-2"
                                >
                                    {filters.categoryId === 'all'
                                        ? 'All Categories'
                                        : selectedCategory?.name || 'Select category...'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-[var(--radix-popover-trigger-width)] p-0"
                                align="start"
                                side="bottom"
                                sideOffset={4}
                            >
                                <Command>
                                    <CommandInput placeholder="Search category..." />
                                    <CommandList>
                                        <CommandEmpty>No category found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value="all"
                                                onSelect={() => {
                                                    onFilterChange({ ...filters, categoryId: 'all' });
                                                    setCategoryOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        filters.categoryId === 'all' ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                All Categories
                                            </CommandItem>
                                            {categories.map((category) => (
                                                <CommandItem
                                                    key={category.id}
                                                    value={category.name}
                                                    onSelect={() => {
                                                        onFilterChange({ ...filters, categoryId: category.id });
                                                        setCategoryOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            filters.categoryId === category.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {category.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label htmlFor="sort-filter">Sort By</Label>
                        <Select
                            value={filters.sortBy}
                            onValueChange={(v) => onFilterChange({ ...filters, sortBy: v })}
                        >
                            <SelectTrigger id="sort-filter">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                <SelectItem value="stock-low">Stock (Low-High)</SelectItem>
                                <SelectItem value="stock-high">Stock (High-Low)</SelectItem>
                                <SelectItem value="updated">Recently Updated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleClearAll}
                    >
                        Clear All Filters
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
