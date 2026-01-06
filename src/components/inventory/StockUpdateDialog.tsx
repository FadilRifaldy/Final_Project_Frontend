'use client'

import { useState } from 'react';
import api from '@/lib/api/axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Minus } from 'lucide-react';

interface InventoryItem {
    productVariantId: string;
    storeId: string;
    quantity: number;
    reserved: number;
    available: number;
    productVariant: {
        name: string;
        sku: string;
        product: {
            name: string;
        };
    };
}

interface StockUpdateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeId: string;
    item: InventoryItem;
    type: 'IN' | 'OUT';
    onSuccess: () => void;
}

export default function StockUpdateDialog({
    open,
    onOpenChange,
    storeId,
    item,
    type,
    onSuccess
}: StockUpdateDialogProps) {
    const [quantity, setQuantity] = useState('');
    const [referenceNo, setReferenceNo] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        const qty = parseInt(quantity);
        if (!qty || qty <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }

        if (!referenceNo.trim()) {
            setError('Reference number is required');
            return;
        }

        if (!reason.trim() || reason.trim().length < 5) {
            setError('Reason must be at least 5 characters');
            return;
        }

        // Validate stock OUT
        if (type === 'OUT' && qty > item.available) {
            setError(`Insufficient stock. Available: ${item.available}`);
            return;
        }

        setLoading(true);

        try {
            const endpoint = type === 'IN'
                ? '/api/stock-journal/in'
                : '/api/stock-journal/out';

            await api.post(
                endpoint,
                {
                    storeId,
                    productVariantId: item.productVariantId,
                    quantity: qty,
                    referenceNo: referenceNo.trim(),
                    reason: reason.trim(),
                    notes: notes.trim() || undefined,
                }
            );

            // Reset form
            setQuantity('');
            setReferenceNo('');
            setReason('');
            setNotes('');

            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update stock');
        } finally {
            setLoading(false);
        }
    };

    const stockAfter = type === 'IN'
        ? item.quantity + parseInt(quantity || '0')
        : item.quantity - parseInt(quantity || '0');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {type === 'IN' ? (
                            <Plus className="h-5 w-5 text-green-600" />
                        ) : (
                            <Minus className="h-5 w-5 text-red-600" />
                        )}
                        Stock {type === 'IN' ? 'IN' : 'OUT'}
                    </DialogTitle>
                    <DialogDescription>
                        {item.productVariant.product.name} - {item.productVariant.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Stock Info */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                        <div>
                            <p className="text-xs text-muted-foreground">Current Stock</p>
                            <p className="text-lg font-bold">{item.quantity}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Reserved</p>
                            <p className="text-lg font-medium text-muted-foreground">{item.reserved}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Available</p>
                            <p className="text-lg font-medium text-green-600">{item.available}</p>
                        </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            Quantity <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>

                    {/* Stock Preview */}
                    {quantity && parseInt(quantity) > 0 && (
                        <div className="p-3 border rounded-lg bg-muted/50">
                            <p className="text-sm font-medium mb-1">Stock Preview:</p>
                            <p className="text-sm">
                                {item.quantity} {type === 'IN' ? '+' : '-'} {quantity} =
                                <span className={`ml-1 font-bold ${stockAfter < 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    {stockAfter}
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Reference Number */}
                    <div className="space-y-2">
                        <Label htmlFor="referenceNo">
                            Reference Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="referenceNo"
                            placeholder="e.g., PO-2025-001, ADJ-001"
                            value={referenceNo}
                            onChange={(e) => setReferenceNo(e.target.value)}
                            required
                        />
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            Reason <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="reason"
                            placeholder={type === 'IN' ? 'e.g., Purchase Order, Restock' : 'e.g., Damaged, Expired'}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>

                    {/* Notes (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : `Confirm Stock ${type}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
