import { IProductImage } from "@/types/product";
import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ImagePreviewProps {
    images: IProductImage[];
    onDelete?: (imageId: string) => void;
    readOnly?: boolean;
}

export function ImagePreview({
    images,
    onDelete,
    readOnly = false,
}: ImagePreviewProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Sort images by order
    const sortedImages = [...images].sort((a, b) => a.order - b.order);

    if (images.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm">
                Belum ada images untuk product ini
            </div>
        );
    }

    return (
        <>
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedImages.map((image) => (
                    <div key={image.id} className="relative group">
                        {/* Image Container */}
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                                src={image.imageUrl}
                                alt={`Product image ${image.order + 1}`}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setLightboxImage(image.imageUrl)}
                            />
                        </div>

                        {/* Order Badge */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            #{image.order + 1}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Zoom Button */}
                            <button
                                type="button"
                                onClick={() => setLightboxImage(image.imageUrl)}
                                className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                                title="View full size"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            {!readOnly && onDelete && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(image.id)}
                                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    title="Delete image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={lightboxImage}
                            alt="Full size preview"
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
