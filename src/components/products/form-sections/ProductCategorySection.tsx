import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types/category";

interface ProductCategorySectionProps {
    categoryId: string;
    setCategoryId: (val: string) => void;
    categories: ICategory[];
}

export function ProductCategorySection({ categoryId, setCategoryId, categories }: ProductCategorySectionProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground italic">
                * Produk wajib memiliki category.
            </p>
        </div>
    );
}
