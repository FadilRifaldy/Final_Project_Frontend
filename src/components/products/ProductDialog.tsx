import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ICategory } from "@/types/category"

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (description: string) => void;
    categoryId: string;
    setCategoryId: (categoryId: string) => void;
    isActive: boolean;
    setIsActive: (isActive: boolean) => void;
    categories: ICategory[];
    onSave: () => void;
}

export function ProductDialog({
    open,
    onOpenChange,
    mode,
    name,
    setName,
    description,
    setDescription,
    categoryId,
    setCategoryId,
    isActive,
    setIsActive,
    categories,
    onSave
}: ProductDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Add Product" : "Edit Product"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Add a new product to the database."
                            : "Make changes to the product."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Product Name *
                        </label>
                        <Input
                            placeholder="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Category *
                        </label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Description *
                        </label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Product description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {mode === "edit" && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">
                                Product is active
                            </label>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onSave}>
                        {mode === "create" ? "Create" : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
