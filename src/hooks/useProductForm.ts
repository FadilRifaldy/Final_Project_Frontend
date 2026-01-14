import { useState, useEffect } from "react";
import { ICategory } from "@/types/category";
import { IProduct } from "@/types/product";

interface UseProductFormProps {
    mode: "create" | "edit";
    initialProduct: IProduct | null;
    onSave: (data: { name: string; description: string; categoryId: string; files: File[] }) => Promise<void>;
    onClose: () => void;
}

export function useProductForm({ mode, initialProduct, onSave, onClose }: UseProductFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync form with initialProduct when editing
    useEffect(() => {
        if (mode === "edit" && initialProduct) {
            setName(initialProduct.name);
            setDescription(initialProduct.description || "");
            setCategoryId(initialProduct.categoryId);
        } else {
            setName("");
            setDescription("");
            setCategoryId("");
        }
        setSelectedFiles([]);
    }, [mode, initialProduct]);

    const validate = () => {
        if (!name.trim()) return "Nama produk wajib diisi";
        if (!categoryId) return "Kategori wajib dipilih";
        if (!description.trim()) return "Deskripsi wajib diisi";
        return null;
    };

    const handleSubmit = async () => {
        const error = validate();
        if (error) {
            alert(error);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                name: name.trim(),
                description: description.trim(),
                categoryId,
                files: selectedFiles,
            });
            onClose();
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        state: {
            name,
            description,
            categoryId,
            selectedFiles,
            isSubmitting,
        },
        setters: {
            setName,
            setDescription,
            setCategoryId,
            setSelectedFiles,
        },
        handleSubmit,
    };
}
