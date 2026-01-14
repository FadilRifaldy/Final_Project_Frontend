"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Image as ImageIcon, Loader2, Star } from 'lucide-react';
import { bulkAssignImagesToVariant, getVariantImages } from '@/lib/helpers/productVariantImage.backend';
import { toast } from 'sonner';

interface ProductImage {
    id: string;
    imageUrl: string;
    order: number;
}

interface VariantImageAssignment {
    id: string;
    productImageId: string;
    isPrimary: boolean;
    image: ProductImage;
}

interface VariantImageSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variantId: string;
    variantName: string;
    productImages: ProductImage[];
    onSuccess: () => void;
}

export default function VariantImageSelector({
    open,
    onOpenChange,
    variantId,
    variantName,
    productImages,
    onSuccess
}: VariantImageSelectorProps) {
    const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
    const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingAssignments, setFetchingAssignments] = useState(false);

    // Fetch existing assignments saat dialog dibuka
    useEffect(() => {
        if (open && variantId) {
            console.log('[VariantImageSelector] Dialog opened');
            console.log('[VariantImageSelector] Product Images received:', productImages);
            console.log('[VariantImageSelector] Product Images count:', productImages.length);
            fetchExistingAssignments();
        }
    }, [open, variantId]);

    const fetchExistingAssignments = async () => {
        setFetchingAssignments(true);
        try {
            const response = await getVariantImages(variantId);
            const assignments: VariantImageAssignment[] = response.data || [];

            const imageIds = assignments.map(a => a.productImageId);
            const primary = assignments.find(a => a.isPrimary);

            setSelectedImageIds(imageIds);
            setPrimaryImageId(primary?.productImageId || null);
        } catch (error: any) {
            console.error('Error fetching assignments:', error);
            toast.error(error.message || 'Failed to load assigned images');
        } finally {
            setFetchingAssignments(false);
        }
    };

    const toggleImageSelection = (imageId: string) => {
        setSelectedImageIds(prev => {
            if (prev.includes(imageId)) {
                // Unselect
                const newSelection = prev.filter(id => id !== imageId);
                // If primary was unselected, clear primary
                if (primaryImageId === imageId) {
                    setPrimaryImageId(newSelection[0] || null);
                }
                return newSelection;
            } else {
                // Select
                const newSelection = [...prev, imageId];
                // If no primary set, make this primary
                if (!primaryImageId) {
                    setPrimaryImageId(imageId);
                }
                return newSelection;
            }
        });
    };

    const handleSetPrimary = (imageId: string) => {
        if (selectedImageIds.includes(imageId)) {
            setPrimaryImageId(imageId);
        } else {
            // Auto-select if not selected
            setSelectedImageIds(prev => [...prev, imageId]);
            setPrimaryImageId(imageId);
        }
    };

    const handleSave = async () => {
        if (selectedImageIds.length === 0) {
            toast.error('Please select at least one image');
            return;
        }

        setLoading(true);
        try {
            await bulkAssignImagesToVariant(variantId, {
                imageIds: selectedImageIds,
                primaryImageId: primaryImageId || selectedImageIds[0]
            });

            toast.success('Images assigned successfully');
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to assign images');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Assign Images to Variant</DialogTitle>
                    <DialogDescription>
                        {variantName} - Select images and set primary image for thumbnail
                    </DialogDescription>
                </DialogHeader>

                {fetchingAssignments ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : productImages.length === 0 ? (
                    <div className="text-center py-12">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No product images available</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Upload product images first before assigning to variants
                        </p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="grid grid-cols-3 gap-4">
                                {productImages.map((image) => {
                                    const isSelected = selectedImageIds.includes(image.id);
                                    const isPrimary = primaryImageId === image.id;

                                    return (
                                        <div
                                            key={image.id}
                                            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected
                                                ? 'border-primary shadow-md'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                            onClick={() => toggleImageSelection(image.id)}
                                        >
                                            {/* Image */}
                                            <div className="aspect-square relative bg-muted">
                                                <img
                                                    src={image.imageUrl}
                                                    alt={`Product image ${image.order + 1}`}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Selected Badge */}
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                )}

                                                {/* Primary Badge */}
                                                {isPrimary && (
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-primary text-primary-foreground border-none px-2 shadow-lg scale-90 origin-top-left transition-transform">
                                                            <ImageIcon className="h-3 w-3 mr-1" />
                                                            Thumbnail
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Set Primary Button */}
                                            {isSelected && !isPrimary && (
                                                <div className="px-2 pb-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="w-full text-[11px] h-7"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSetPrimary(image.id);
                                                        }}
                                                    >
                                                        Set as Thumbnail
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                    );
                                })}
                            </div>
                        </ScrollArea>

                        <div className="text-sm text-muted-foreground">
                            <p>
                                Selected: <span className="font-medium">{selectedImageIds.length}</span> image(s)
                            </p>
                            {primaryImageId && (
                                <p className="text-yellow-600 dark:text-yellow-500">
                                    Primary image will be used as variant thumbnail
                                </p>
                            )}
                        </div>
                    </>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading || selectedImageIds.length === 0 || fetchingAssignments}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Assignment'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
