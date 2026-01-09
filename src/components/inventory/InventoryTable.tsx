'use client'

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, History, Plus, Minus, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StockUpdateDialog from './StockUpdateDialog';
import StockHistoryDialog from './StockHistoryDialog';

interface InventoryItem {
    productVariantId: string;
    storeId: string;
    quantity: number;
    reserved: number;
    available: number;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        price: number;
        product: {
            name: string;
            category: {
                name: string;
            };
        };
    };
}

interface InventoryTableProps {
    storeId: string;
    inventories: InventoryItem[];
    loading: boolean;
    onRefresh: () => void;
}

export default function InventoryTable({
    storeId,
    inventories,
    loading,
    onRefresh
}: InventoryTableProps) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [updateType, setUpdateType] = useState<'IN' | 'OUT'>('IN');

    const handleStockUpdate = (item: InventoryItem, type: 'IN' | 'OUT') => {
        setSelectedItem(item);
        setUpdateType(type);
        setUpdateDialogOpen(true);
    };

    const handleViewHistory = (item: InventoryItem) => {
        setSelectedItem(item);
        setHistoryDialogOpen(true);
    };

    const handleUpdateSuccess = () => {
        setUpdateDialogOpen(false);
        onRefresh();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-muted animate-pulse rounded" />
                <div className="h-64 bg-muted animate-pulse rounded" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Inventory Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">Product</TableHead>
                            <TableHead className="text-center">SKU</TableHead>
                            <TableHead className="text-center">Category</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Reserved</TableHead>
                            <TableHead className="text-center">Available</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">
                                        No inventory data
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            inventories.map((item) => (
                                <TableRow key={`${item.productVariantId}-${item.storeId}`}>
                                    <TableCell className="text-left">
                                        <div>
                                            <p className="font-medium">{item.productVariant.product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.productVariant.name}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                            {item.productVariant.sku}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">
                                            {item.productVariant.product.category.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {item.reserved}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Visual progress indicator */}
                                            <div className="relative w-12 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "absolute inset-y-0 left-0 rounded-full transition-all",
                                                        item.available > 50 ? "bg-green-500" :
                                                            item.available > 10 ? "bg-amber-500" :
                                                                item.available > 0 ? "bg-orange-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${Math.min((item.available / item.quantity) * 100, 100)}%` }}
                                                />
                                            </div>

                                            {/* Number with tabular nums */}
                                            <span className="text-sm font-medium tabular-nums">
                                                {item.available}
                                            </span>

                                            {/* Warning icons */}
                                            {item.available <= 10 && item.available > 0 && (
                                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                            )}
                                            {item.available === 0 && (
                                                <XCircle className="h-3 w-3 text-red-500" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={() => handleStockUpdate(item, 'IN')}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={() => handleStockUpdate(item, 'OUT')}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={() => handleViewHistory(item)}
                                            >
                                                <History className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialogs */}
            {selectedItem && (
                <>
                    <StockUpdateDialog
                        open={updateDialogOpen}
                        onOpenChange={setUpdateDialogOpen}
                        storeId={storeId}
                        item={selectedItem}
                        type={updateType}
                        onSuccess={handleUpdateSuccess}
                    />
                    <StockHistoryDialog
                        open={historyDialogOpen}
                        onOpenChange={setHistoryDialogOpen}
                        storeId={storeId}
                        variantId={selectedItem.productVariantId}
                        productName={`${selectedItem.productVariant.product.name} - ${selectedItem.productVariant.name}`}
                    />
                </>
            )}
        </div>
    );
}
