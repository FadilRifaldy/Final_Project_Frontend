import { Label } from "@/components/ui/label";
import { ImageUploader } from "../ImageUploader";
import { ImagePreview } from "../ImagePreview";
import { IProductImage } from "@/types/product";

interface ProductImageSectionProps {
    mode: "create" | "edit";
    existingImages: IProductImage[];
    setSelectedFiles: (files: File[]) => void;
}

export function ProductImageSection({ mode, existingImages, setSelectedFiles }: ProductImageSectionProps) {
    return (
        <div className="border-t pt-4 space-y-4">
            <Label className="text-base font-semibold">Product Images</Label>

            {mode === "edit" && existingImages.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Existing Images:</p>
                    <ImagePreview images={existingImages} readOnly />
                </div>
            )}

            <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                    {mode === "create" ? "Upload images for this product:" : "Add more images:"}
                </p>
                <ImageUploader
                    onFilesSelected={setSelectedFiles}
                    maxFiles={5}
                    maxSizeMB={5}
                />
            </div>
        </div>
    );
}
