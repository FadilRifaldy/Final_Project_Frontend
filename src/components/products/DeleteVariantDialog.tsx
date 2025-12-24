import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { IProductVariant } from "@/types/product"

interface DeleteVariantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedVariant: IProductVariant | null;
    onConfirm: () => void;
}

export function DeleteVariantDialog({
    open,
    onOpenChange,
    selectedVariant,
    onConfirm
}: DeleteVariantDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Variant</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this variant? This action cannot
                        be undone.
                    </DialogDescription>
                </DialogHeader>
                {selectedVariant && (
                    <div className="py-4">
                        <p className="text-sm">
                            <span className="font-semibold">SKU:</span>{" "}
                            <span className="font-mono">{selectedVariant.sku}</span>
                        </p>
                        <p className="text-sm mt-1">
                            <span className="font-semibold">Variant:</span>{" "}
                            {selectedVariant.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Price: Rp {selectedVariant.price.toLocaleString('id-ID')}
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
