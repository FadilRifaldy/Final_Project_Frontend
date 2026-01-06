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
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [updateType, setUpdateType] = useState<'IN' | 'OUT'>('IN');

    // Filter inventories by search
    const filteredInventories = inventories.filter((item) => {
        const searchLower = search.toLowerCase();
        return (
            item.productVariant.name.toLowerCase().includes(searchLower) ||
            item.productVariant.sku.toLowerCase().includes(searchLower) ||
            item.productVariant.product.name.toLowerCase().includes(searchLower)
        );
    });

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
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by product name or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Reserved</TableHead>
                            <TableHead className="text-right">Available</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInventories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">
                                        {search ? 'No products found' : 'No inventory data'}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInventories.map((item) => (
                                <TableRow key={`${item.productVariantId}-${item.storeId}`}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{item.productVariant.product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.productVariant.name}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                            {item.productVariant.sku}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {item.productVariant.product.category.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {item.reserved}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant={item.available > 10 ? 'default' : item.available > 0 ? 'secondary' : 'destructive'}
                                        >
                                            {item.available}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleStockUpdate(item, 'IN')}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                IN
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleStockUpdate(item, 'OUT')}
                                            >
                                                <Minus className="h-4 w-4 mr-1" />
                                                OUT
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleViewHistory(item)}
                                            >
                                                <History className="h-4 w-4" />
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
