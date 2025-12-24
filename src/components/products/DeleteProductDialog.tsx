import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { IProduct } from "@/types/product"

interface DeleteProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedProduct: IProduct | null;
    onConfirm: () => void;
}

export function DeleteProductDialog({
    open,
    onOpenChange,
    selectedProduct,
    onConfirm
}: DeleteProductDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product? This action cannot
                        be undone.
                    </DialogDescription>
                </DialogHeader>
                {selectedProduct && (
                    <div className="py-4">
                        <p className="text-sm">
                            <span className="font-semibold">Product:</span>{" "}
                            {selectedProduct.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedProduct.description}
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}