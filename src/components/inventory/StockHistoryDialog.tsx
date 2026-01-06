'use client'

import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, TrendingUp, TrendingDown, Calendar, User } from 'lucide-react';
import dayjs from 'dayjs';

interface StockJournal {
    id: string;
    type: 'IN' | 'OUT';
    quantity: number;
    stockBefore: number;
    stockAfter: number;
    referenceNo: string;
    reason: string;
    notes?: string;
    createdAt: string;
    creator: {
        name: string;
        email: string;
    };
}

interface StockHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeId: string;
    variantId: string;
    productName: string;
}

export default function StockHistoryDialog({
    open,
    onOpenChange,
    storeId,
    variantId,
    productName
}: StockHistoryDialogProps) {
    const [journals, setJournals] = useState<StockJournal[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && storeId && variantId) {
            fetchHistory();
        }
    }, [open, storeId, variantId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get(
                `/api/stock-journal/variant/${storeId}/${variantId}`,
                {
                    params: { page: 1, limit: 50 }
                }
            );
            setJournals(response.data.data || []);
        } catch (error) {
            console.error('Error fetching stock history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Stock History
                    </DialogTitle>
                    <DialogDescription>{productName}</DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[500px] pr-4">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                            ))}
                        </div>
                    ) : journals.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No stock history found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {journals.map((journal) => (
                                <div
                                    key={journal.id}
                                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {journal.type === 'IN' ? (
                                                <TrendingUp className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <TrendingDown className="h-5 w-5 text-red-600" />
                                            )}
                                            <Badge variant={journal.type === 'IN' ? 'default' : 'destructive'}>
                                                Stock {journal.type}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {journal.type === 'IN' ? '+' : '-'}{journal.quantity} pcs
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {journal.stockBefore} → {journal.stockAfter}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Stock Change</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Reference No:</p>
                                            <p className="font-medium">{journal.referenceNo}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Reason:</p>
                                            <p className="font-medium">{journal.reason}</p>
                                        </div>
                                    </div>

                                    {journal.notes && (
                                        <div className="mt-2 text-sm">
                                            <p className="text-muted-foreground">Notes:</p>
                                            <p className="text-sm bg-muted p-2 rounded mt-1">{journal.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            <span>{journal.creator.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {dayjs(journal.createdAt).format('DD MMM YYYY, HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
