"use client";

import { useEffect, useState } from "react";
import { useDiscountStore } from "@/lib/store/discountStore";
import { Discount } from "@/types/discount";
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

export default function DiscountsPage() {
    const { discounts, isLoading, fetchDiscounts, toggleStatus, deleteDiscount } =
        useDiscountStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
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
                <Button>
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

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredDiscounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
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
        </div>
    );
}