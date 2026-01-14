import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { ICategory } from "@/types/category"
import { IProduct, IProductImage } from "@/types/product"
import { Loader2 } from "lucide-react"
import { useProductForm } from "@/hooks/useProductForm"

// Form Sections
import { ProductInfoSection } from "./form-sections/ProductInfoSection"
import { ProductCategorySection } from "./form-sections/ProductCategorySection"
import { ProductImageSection } from "./form-sections/ProductImageSection"

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    initialProduct: IProduct | null;
    categories: ICategory[];
    onSave: (data: { name: string; description: string; categoryId: string; files: File[] }) => Promise<void>;
}

export function ProductDialog({
    open,
    onOpenChange,
    mode,
    initialProduct,
    categories,
    onSave
}: ProductDialogProps) {
    const { state, setters, handleSubmit } = useProductForm({
        mode,
        initialProduct,
        onSave,
        onClose: () => onOpenChange(false)
    });

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

                <div className="space-y-6 py-4">
                    <ProductInfoSection
                        name={state.name}
                        setName={setters.setName}
                        description={state.description}
                        setDescription={setters.setDescription}
                    />

                    <ProductCategorySection
                        categoryId={state.categoryId}
                        setCategoryId={setters.setCategoryId}
                        categories={categories}
                    />

                    <ProductImageSection
                        mode={mode}
                        existingImages={initialProduct?.images || []}
                        setSelectedFiles={setters.setSelectedFiles}
                    />
                </div>

                <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={state.isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={state.isSubmitting}
                    >
                        {state.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === "create" ? "Creating..." : "Updating..."}
                            </>
                        ) : (
                            mode === "create" ? "Create Product" : "Update Product"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

