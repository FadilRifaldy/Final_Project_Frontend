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
import { Search, Package, History, Plus, Minus } from 'lucide-react';
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
                                        <Badge
                                            variant={item.available > 10 ? 'default' : item.available > 0 ? 'secondary' : 'destructive'}
                                        >
                                            {item.available}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleStockUpdate(item, 'IN')}
                                                className="h-8"
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                IN
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleStockUpdate(item, 'OUT')}
                                                className="h-8"
                                            >
                                                <Minus className="h-3 w-3 mr-1" />
                                                OUT
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleViewHistory(item)}
                                                className="h-8"
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
