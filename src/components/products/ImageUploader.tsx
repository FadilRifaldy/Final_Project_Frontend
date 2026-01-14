import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface ImageUploaderProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
}

export function ImageUploader({
    onFilesSelected,
    maxFiles = 5,
    maxSizeMB = 5,
}: ImageUploaderProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validasi file
    const validateFile = (file: File): string | null => {
        // Check if it's an image
        if (!file.type.startsWith("image/")) {
            return `${file.name} bukan file image`;
        }

        // Check file size (convert MB to bytes)
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `${file.name} terlalu besar (max ${maxSizeMB}MB)`;
        }

        return null;
    };

    // Handle file selection
    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);
        const errors: string[] = [];
        const validFiles: File[] = [];

        // Check total files
        if (selectedFiles.length + fileArray.length > maxFiles) {
            setError(`Maksimal ${maxFiles} images`);
            return;
        }

        // Validate each file
        fileArray.forEach((file) => {
            const error = validateFile(file);
            if (error) {
                errors.push(error);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            setError(errors.join(", "));
            return;
        }

        // Clear error
        setError("");

        // Create previews
        const newPreviews: string[] = [];
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === validFiles.length) {
                    setPreviews([...previews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Update state
        const updatedFiles = [...selectedFiles, ...validFiles];
        setSelectedFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    // Handle drag events
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // Handle file input change
    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    // Remove file
    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        setPreviews(updatedPreviews);
        onFilesSelected(updatedFiles);
        setError("");
    };

    // Trigger file input
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-primary hover:bg-gray-50"
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium">
                            Drag & drop images atau klik untuk pilih
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                            JPG, JPEG, PNG, GIF, WEBP
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                            Max {maxFiles} files, {maxSizeMB}MB per file
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                    {error}
                </div>
            )}

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                            {/* Image Preview */}
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Order Badge */}
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                #{index + 1}
                            </div>

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* File Info */}
                            <div className="mt-1 text-xs text-gray-600 truncate">
                                {selectedFiles[index]?.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* File Count */}
            {selectedFiles.length > 0 && (
                <p className="text-sm text-gray-600">
                    {selectedFiles.length} / {maxFiles} images selected
                </p>
            )}
        </div>
    );
}
