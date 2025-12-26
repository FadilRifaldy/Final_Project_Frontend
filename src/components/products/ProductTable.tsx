import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { IProduct } from "@/types/product"
import { ICategory } from "@/types/category"

interface ProductTableProps {
    products: IProduct[];
    categories: ICategory[];
    loading: boolean;
    currentRole: "SUPER_ADMIN" | "STORE_ADMIN";
    onEdit: (product: IProduct) => void;
    onDelete: (product: IProduct) => void;
    onManageVariants: (product: IProduct) => void;
}

export function ProductTable({
    products,
    categories,
    loading,
    currentRole,
    onEdit,
    onDelete,
    onManageVariants
}: ProductTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.length === 0 && !loading ? (
                    <TableRow>
                        <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground"
                        >
                            No products found
                        </TableCell>
                    </TableRow>
                ) : (
                    products.map((product: IProduct) => {
                        const category = categories.find(
                            (cat) => cat.id === product.categoryId
                        );

                        return (
                            <TableRow key={product.id}>
                                {/* Product Image Thumbnail */}
                                <TableCell>
                                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0].imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">No image</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{category?.name || "-"}</TableCell>
                                <TableCell>
                                    {currentRole === "SUPER_ADMIN" && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="transition-all hover:scale-105 hover:shadow-md"
                                                onClick={() => onEdit(product)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="transition-all hover:scale-105 hover:shadow-md"
                                                onClick={() => onManageVariants(product)}
                                            >
                                                Variants
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="transition-all hover:scale-105 hover:shadow-md"
                                                onClick={() => onDelete(product)}
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
