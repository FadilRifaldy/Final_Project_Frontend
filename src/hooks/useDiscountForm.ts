import { useState } from "react";
import { DiscountType, DiscountValueType, CreateDiscountInput } from "@/types/discount";

interface UseDiscountFormProps {
    userRole: "SUPER_ADMIN" | "STORE_ADMIN";
    userStoreId?: string;
    onSubmit: (data: CreateDiscountInput) => Promise<void>;
    onClose: () => void;
}

export function useDiscountForm({ userRole, userStoreId, onSubmit, onClose }: UseDiscountFormProps) {
    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<DiscountType>("PRODUCT");
    const [discountValueType, setDiscountValueType] = useState<DiscountValueType>("PERCENTAGE");
    const [discountValue, setDiscountValue] = useState("");
    const [minPurchase, setMinPurchase] = useState("");
    const [maxDiscount, setMaxDiscount] = useState("");
    const [buyQuantity, setBuyQuantity] = useState("");
    const [getQuantity, setGetQuantity] = useState("");
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [productVariantIds, setProductVariantIds] = useState<string[]>([]);
    const [discountScope, setDiscountScope] = useState<"global" | "store">("global");
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setName("");
        setDescription("");
        setType("PRODUCT");
        setDiscountValueType("PERCENTAGE");
        setDiscountValue("");
        setMinPurchase("");
        setMaxDiscount("");
        setBuyQuantity("");
        setGetQuantity("");
        setStartDate(undefined);
        setEndDate(undefined);
        setProductVariantIds([]);
        setDiscountScope("global");
        setSelectedStoreId("");
    };

    const validate = (): string | null => {
        // Basic validation
        if (!name.trim()) {
            return "Nama discount harus diisi";
        }

        if (!discountValue || parseFloat(discountValue) <= 0) {
            return "Nilai discount harus lebih dari 0";
        }

        if (!startDate || !endDate) {
            return "Tanggal mulai dan berakhir harus diisi";
        }

        if (startDate >= endDate) {
            return "Tanggal berakhir harus setelah tanggal mulai";
        }

        // Type-specific validation
        if (type === "BUY_ONE_GET_ONE") {
            if (!buyQuantity || !getQuantity) {
                return "Buy quantity dan Get quantity harus diisi untuk BOGO";
            }
        }

        if (type === "PRODUCT" && productVariantIds.length === 0) {
            return "Pilih minimal 1 product variant untuk Product Discount";
        }

        // Store Admin validation
        if (userRole === "STORE_ADMIN" && !userStoreId) {
            return "Store Admin belum di-assign ke store. Hubungi Super Admin untuk assign store.";
        }

        return null;
    };

    const handleSubmit = async () => {
        // Validate
        const error = validate();
        if (error) {
            alert(error);
            return;
        }

        setIsSubmitting(true);

        try {
            // Determine storeId berdasarkan role dan scope
            let storeIdToSend: string | undefined = undefined;

            if (userRole === "STORE_ADMIN") {
                storeIdToSend = userStoreId;
            } else if (userRole === "SUPER_ADMIN") {
                if (discountScope === "store") {
                    storeIdToSend = selectedStoreId || undefined;
                }
            }

            const data: CreateDiscountInput = {
                name: name.trim(),
                description: description.trim() || undefined,
                type,
                discountValueType,
                discountValue: parseFloat(discountValue),
                minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
                buyQuantity: buyQuantity ? parseInt(buyQuantity) : undefined,
                getQuantity: getQuantity ? parseInt(getQuantity) : undefined,
                productVariantIds: productVariantIds.length > 0 ? productVariantIds : undefined,
                startDate: startDate!.toISOString(),
                endDate: endDate!.toISOString(),
                storeId: storeIdToSend,
            };

            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error("Error creating discount:", error);
            alert("Failed to create discount. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // Form state
        formState: {
            name,
            description,
            type,
            discountValueType,
            discountValue,
            minPurchase,
            maxDiscount,
            buyQuantity,
            getQuantity,
            startDate,
            endDate,
            productVariantIds,
            discountScope,
            selectedStoreId,
        },
        // Setters
        setters: {
            setName,
            setDescription,
            setType,
            setDiscountValueType,
            setDiscountValue,
            setMinPurchase,
            setMaxDiscount,
            setBuyQuantity,
            setGetQuantity,
            setStartDate,
            setEndDate,
            setProductVariantIds,
            setDiscountScope,
            setSelectedStoreId,
        },
        // Actions
        isSubmitting,
        resetForm,
        handleSubmit,
    };
}
