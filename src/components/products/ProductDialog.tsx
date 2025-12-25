import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ICategory } from "@/types/category"
import { IProductImage } from "@/types/product"
import { ImageUploader } from "./ImageUploader"
import { ImagePreview } from "./ImagePreview"
import { Loader2 } from "lucide-react"

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
    categories: ICategory[];
    // Image-related props
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
    existingImages?: IProductImage[];
    // Loading state
    loading?: boolean;
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
    categories,
    selectedFiles,
    setSelectedFiles,
    existingImages = [],
    loading = false,
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

                    {/* Divider */}
                    <div className="border-t pt-4">
                        <label className="text-sm font-medium mb-2 block">
                            Product Images
                        </label>

                        {/* Existing Images (Edit Mode) */}
                        {mode === "edit" && existingImages.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2">Existing Images:</p>
                                <ImagePreview images={existingImages} readOnly />
                            </div>
                        )}

                        {/* Image Uploader */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2">
                                {mode === "create"
                                    ? "Upload images for this product:"
                                    : "Add more images:"}
                            </p>
                            <ImageUploader
                                onFilesSelected={setSelectedFiles}
                                maxFiles={5}
                                maxSizeMB={5}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === "create" ? "Creating..." : "Updating..."}
                            </>
                        ) : (
                            mode === "create" ? "Create" : "Update"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
