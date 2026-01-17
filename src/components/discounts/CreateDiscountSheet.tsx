"use client";

import { useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateDiscountInput } from "@/types/discount";
import { useDiscountForm } from "@/hooks/useDiscountForm";

// Form Sections
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ScopeSection } from "./form-sections/ScopeSection";
import { ValueSection } from "./form-sections/ValueSection";
import { ConditionalFieldsSection } from "./form-sections/ConditionalFieldsSection";
import { DateRangeSection } from "./form-sections/DateRangeSection";
import { ProductVariantSection } from "./form-sections/ProductVariantSection";

interface CreateDiscountSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateDiscountInput) => Promise<void>;
    userRole: "SUPER_ADMIN" | "STORE_ADMIN";
    userStoreId?: string;
}

export function CreateDiscountSheet({
    open,
    onOpenChange,
    onSubmit,
    userRole,
    userStoreId,
}: CreateDiscountSheetProps) {
    const {
        formState,
        setters,
        isSubmitting,
        resetForm,
        handleSubmit,
    } = useDiscountForm({
        userRole,
        userStoreId,
        onSubmit,
        onClose: () => onOpenChange(false),
    });

    // Reset form when sheet closes
    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
                <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle>Create Discount</SheetTitle>

                    <SheetDescription>
                        Create a new discount for your store. Fill in the details below.
                    </SheetDescription>
                </SheetHeader>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-6">
                        <BasicInfoSection
                            name={formState.name}
                            setName={setters.setName}
                            description={formState.description}
                            setDescription={setters.setDescription}
                            type={formState.type}
                            setType={setters.setType}
                        />

                        <ProductVariantSection
                            type={formState.type}
                            productVariantIds={formState.productVariantIds}
                            setProductVariantIds={setters.setProductVariantIds}
                        />

                        <ScopeSection
                            userRole={userRole}
                            userStoreId={userStoreId}
                            discountScope={formState.discountScope}
                            setDiscountScope={setters.setDiscountScope}
                            selectedStoreId={formState.selectedStoreId}
                            setSelectedStoreId={setters.setSelectedStoreId}
                        />

                        <ValueSection
                            discountValueType={formState.discountValueType}
                            setDiscountValueType={setters.setDiscountValueType}
                            discountValue={formState.discountValue}
                            setDiscountValue={setters.setDiscountValue}
                        />

                        <ConditionalFieldsSection
                            type={formState.type}
                            discountValueType={formState.discountValueType}
                            minPurchase={formState.minPurchase}
                            setMinPurchase={setters.setMinPurchase}
                            maxDiscount={formState.maxDiscount}
                            setMaxDiscount={setters.setMaxDiscount}
                            buyQuantity={formState.buyQuantity}
                            setBuyQuantity={setters.setBuyQuantity}
                            getQuantity={formState.getQuantity}
                            setGetQuantity={setters.setGetQuantity}
                        />

                        <DateRangeSection
                            startDate={formState.startDate}
                            setStartDate={setters.setStartDate}
                            endDate={formState.endDate}
                            setEndDate={setters.setEndDate}
                        />


                    </div>
                </div>

                {/* Fixed Footer Buttons */}
                <div className="px-6 py-4 bg-background border-t flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Discount"
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
