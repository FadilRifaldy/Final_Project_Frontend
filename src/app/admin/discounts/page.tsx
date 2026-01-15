"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { useDiscountStore } from "@/lib/store/discountStore";
import { Discount, CreateDiscountInput } from "@/types/discount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, Pencil, Trash2, Power, Search } from "lucide-react";
import { format } from "date-fns";
import { CreateDiscountSheet } from "@/components/discounts/CreateDiscountSheet";

export default function DiscountsPage() {
    const { discounts, isLoading, fetchDiscounts, toggleStatus, deleteDiscount, createDiscount } =
        useDiscountStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

    // User info
    const [userRole, setUserRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN">("SUPER_ADMIN");
    const [userStoreId, setUserStoreId] = useState<string>();

    useEffect(() => {
        // Fetch user info
        const fetchUserInfo = async () => {
            try {
                const response = await api.get("/auth/dashboard");
                const userData = response.data.user;

                setUserRole(userData.role);

                // If Store Admin, get their store ID
                if (userData.role === "STORE_ADMIN" && userData.assignedStoreId) {
                    setUserStoreId(userData.assignedStoreId);
                }

                console.log("User info:", userData); // Debug log
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
        fetchDiscounts();
    }, [fetchDiscounts]);

    const filteredDiscounts = discounts.filter((discount) =>
        discount.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDiscountTypeBadge = (type: string) => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
            PRODUCT: "default",
            CART: "secondary",
            BUY_ONE_GET_ONE: "outline",
            SHIPPING: "outline",
        };
        return <Badge variant={variants[type] || "default"}>{type}</Badge>;
    };

    const getDiscountValueDisplay = (discount: Discount) => {
        if (discount.discountValueType === "PERCENTAGE") {
            return `${discount.discountValue}%`;
        }
        return `Rp ${discount.discountValue.toLocaleString("id-ID")}`;
    };

    // handler

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await toggleStatus(id, !currentStatus);
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this discount?")) {
            try {
                await deleteDiscount(id);
            } catch (error) {
                console.error("Failed to delete discount:", error);
            }
        }
    };

    const handleCreateDiscount = async (data: CreateDiscountInput) => {
        try {
            await createDiscount(data);
            setIsCreateSheetOpen(false);
        } catch (error) {
            console.error("Failed to create discount:", error);
            throw error; // Re-throw untuk ditangani di Sheet component
        }
    };

    // Check if STORE_ADMIN has assigned store
    if (userRole === "STORE_ADMIN" && !userStoreId) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6">
                <div className="max-w-md w-full space-y-4 text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-yellow-900 mb-2">
                            No Store Assigned
                        </h2>
                        <p className="text-yellow-700 mb-4">
                            You haven't been assigned to any store yet. Please contact your Super Admin to assign you to a store before you can manage discounts.
                        </p>
                        <Button
                            onClick={() => window.location.href = '/admin/dashboard'}
                            variant="outline"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Discounts</h1>
                    <p className="text-muted-foreground">
                        Manage your product and cart discounts
                    </p>
                </div>
                <Button onClick={() => setIsCreateSheetOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Discount
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search discounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table discounts */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Products</TableHead>
                            {userRole === "SUPER_ADMIN" && <TableHead>Store</TableHead>}
                            <TableHead>Period</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={userRole === "SUPER_ADMIN" ? 8 : 7} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredDiscounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={userRole === "SUPER_ADMIN" ? 8 : 7} className="text-center py-8">
                                    No discounts found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDiscounts.map((discount) => (
                                <TableRow key={discount.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{discount.name}</div>
                                            {discount.description && (
                                                <div className="text-sm text-muted-foreground">
                                                    {discount.description}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getDiscountTypeBadge(discount.type)}</TableCell>
                                    <TableCell className="font-medium">
                                        {getDiscountValueDisplay(discount)}
                                    </TableCell>
                                    <TableCell>
                                        {(discount.type === "PRODUCT" || discount.type === "BUY_ONE_GET_ONE") ? (
                                            discount.productDiscounts && discount.productDiscounts.length > 0 ? (
                                                <div className="space-y-1">
                                                    {discount.productDiscounts.slice(0, 2).map((pd) => (
                                                        <div key={pd.id} className="text-xs text-muted-foreground">
                                                            {pd.productVariant?.product?.name || pd.productVariant?.name}
                                                        </div>
                                                    ))}
                                                    {discount.productDiscounts.length > 2 && (
                                                        <div className="text-xs text-muted-foreground font-medium">
                                                            +{discount.productDiscounts.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">-</span>
                                            )
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    {userRole === "SUPER_ADMIN" && (
                                        <TableCell>
                                            {discount.store ? (
                                                <span className="text-sm">{discount.store.name}</span>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    All Stores
                                                </Badge>
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>
                                                {format(new Date(discount.startDate), "dd MMM yyyy")}
                                            </div>
                                            <div className="text-muted-foreground">
                                                to {format(new Date(discount.endDate), "dd MMM yyyy")}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={discount.isActive ? "default" : "secondary"}>
                                            {discount.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            discount.id,
                                                            discount.isActive
                                                        )
                                                    }
                                                >
                                                    <Power className="w-4 h-4 mr-2" />
                                                    {discount.isActive ? "Deactivate" : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(discount.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Discount Sheet */}
            <CreateDiscountSheet
                open={isCreateSheetOpen}
                onOpenChange={setIsCreateSheetOpen}
                onSubmit={handleCreateDiscount}
                userRole={userRole}
                userStoreId={userStoreId}
            />
        </div>
    );
}