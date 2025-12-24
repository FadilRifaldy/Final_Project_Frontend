import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { IProductVariant } from "@/types/product"

interface VariantTableProps {
    variants: IProductVariant[];
    loading: boolean;
    currentRole: "SUPER_ADMIN" | "STORE_ADMIN";
    onEdit: (variant: IProductVariant) => void;
    onDelete: (variant: IProductVariant) => void;
}

export function VariantTable({
    variants,
    loading,
    currentRole,
    onEdit,
    onDelete
}: VariantTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Weight (gr)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {variants.length === 0 && !loading ? (
                    <TableRow>
                        <TableCell
                            colSpan={8}
                            className="text-center text-muted-foreground"
                        >
                            No variants found. Click "Add Variant" to create one.
                        </TableCell>
                    </TableRow>
                ) : (
                    variants.map((variant: IProductVariant) => {
                        return (
                            <TableRow key={variant.id}>
                                <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                                <TableCell className="font-medium">{variant.name}</TableCell>
                                <TableCell>
                                    Rp {variant.price.toLocaleString('id-ID')}
                                </TableCell>
                                <TableCell>
                                    {variant.color ? (
                                        <span className="px-2 py-1 rounded text-xs bg-gray-100">
                                            {variant.color}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {variant.size ? (
                                        <span className="px-2 py-1 rounded text-xs bg-gray-100">
                                            {variant.size}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {variant.weight ? `${variant.weight}g` : '-'}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${variant.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {variant.isActive ? "Active" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {currentRole === "SUPER_ADMIN" && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="transition-all hover:scale-105 hover:shadow-md"
                                                onClick={() => onEdit(variant)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="transition-all hover:scale-105 hover:shadow-md"
                                                onClick={() => onDelete(variant)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    )
}
