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

    // Pagination props
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export function ProductTable({
    products,
    categories,
    loading,
    currentRole,
    onEdit,
    onDelete,
    onManageVariants,
    currentPage,
    totalPages,
    totalItems,
    onPageChange
}: ProductTableProps) {
    return (
        <div className="mx-auto max-w-6xl max-h-[calc(100vh-250px)] border border-gray-200 rounded-xl p-4 overflow-auto">
            <Table className="mx-auto">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    {/* Pagination Info */}
                    <div className="text-sm text-gray-600">
                        Showing {products.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} - {Math.min(currentPage * 10, totalItems)} of {totalItems} products
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="transition-all hover:scale-105"
                        >
                            Previous
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // Show first page, last page, current page, and pages around current
                                const showPage =
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!showPage) {
                                    // Show ellipsis
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="px-2 text-gray-400">...</span>;
                                    }
                                    return null;
                                }

                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onPageChange(page)}
                                        className="min-w-[40px] transition-all hover:scale-105"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="transition-all hover:scale-105"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
