"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { IProduct } from "@/types/product";
import { Search, X, Loader2 } from "lucide-react";
import { useProductStore } from "@/lib/store/productStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductDialog } from "@/components/products/ProductDialog";
import { DeleteProductDialog } from "@/components/products/DeleteProductDialog";
import { VariantManagementPanel } from "@/components/products/VariantManagementPanel";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const [currentRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN">("SUPER_ADMIN");
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Local loading state for dialog
  const [isSaving, setIsSaving] = useState(false);

  // Search state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Variant panel state
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<IProduct | null>(null);
  const [isVariantPanelOpen, setIsVariantPanelOpen] = useState(false);

  // Ambil data dan functions dari Zustand stores
  const {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    setPage,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();

  // Fetch data saat component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);



  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products by category and search (client-side filtering on current page)
  const filteredProducts = products.filter(product => {
    // Filter by category
    const matchesCategory = selectedCategoryFilter === "all" || product.categoryId === selectedCategoryFilter;

    // Filter by search query (name only)
    const matchesSearch = debouncedSearch === "" ||
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // For server-side pagination, we use products directly (already paginated by backend)
  // But we still apply client-side filters for category and search
  // TODO: Move filters to backend API for better performance

  // Reset to page 1 and fetch when filters change
  useEffect(() => {
    fetchProducts(1, itemsPerPage);
  }, [selectedCategoryFilter, debouncedSearch, fetchProducts, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Handler untuk create button
  const handleCreate = () => {
    setDialogMode("create");
    setSelectedProduct(null);
    setName("");
    setDescription("");
    setCategoryId("");
    setSelectedFiles([]);  // Reset selected files
    setDialogOpen(true);
  };

  // Handler untuk edit button
  const handleEdit = (product: IProduct) => {
    setDialogMode("edit");
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategoryId(product.categoryId);
    setSelectedFiles([]);  // Reset selected files for edit mode
    setDialogOpen(true);
  };

  // Handler untuk delete button
  const handleDelete = (product: IProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // Handler untuk manage variants - Open split view panel
  const handleManageVariants = async (product: IProduct) => {
    setSelectedProductForVariants(product);
    setIsVariantPanelOpen(true);
    // Refresh products in background to get latest images
    await fetchProducts(currentPage, itemsPerPage);
  };

  // Sync selectedProductForVariants with latest product data after refresh
  useEffect(() => {
    if (selectedProductForVariants && isVariantPanelOpen) {
      const updatedProduct = products.find(p => p.id === selectedProductForVariants.id);
      if (updatedProduct && updatedProduct.images.length !== selectedProductForVariants.images.length) {
        setSelectedProductForVariants(updatedProduct);
      }
    }
  }, [products, selectedProductForVariants, isVariantPanelOpen]);

  // Konfirmasi delete
  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
    }
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  // Handler untuk save (create atau update)
  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (dialogMode === "create") {
        // 1. Create product first
        const newProduct = await addProduct(name, description, categoryId, []);

        // 2. Upload images if any selected
        if (selectedFiles.length > 0 && newProduct) {
          const latestProducts = products;
          const createdProduct = latestProducts[latestProducts.length - 1];

          if (createdProduct) {
            await uploadProductImages(createdProduct.id, selectedFiles);
          }
        }

        // Show success toast
        toast.success("Product created successfully!", {
          description: selectedFiles.length > 0
            ? `Product created with ${selectedFiles.length} image(s)`
            : "Product created without images"
        });
      } else if (dialogMode === "edit" && selectedProduct) {
        // 1. Update product data
        await updateProduct(
          selectedProduct.id,
          name,
          description,
          categoryId,
          []  // Images handled separately
        );

        // 2. Upload new images if any selected
        if (selectedFiles.length > 0) {
          await uploadProductImages(selectedProduct.id, selectedFiles);
        }

        // Show success toast
        toast.success("Product updated successfully!", {
          description: selectedFiles.length > 0
            ? `Updated with ${selectedFiles.length} new image(s)`
            : "Product updated"
        });
      }

      // Close dialog and reset
      setDialogOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error saving product:", error);

      // Show error toast
      toast.error("Failed to save product", {
        description: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600 text-sm">Kelola semua produk perusahaan</p>
        </div>
        {currentRole === "SUPER_ADMIN" && (
          <Button onClick={handleCreate}>+ Create Product</Button>
        )}
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Category:</label>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Category Filter Button */}
        {selectedCategoryFilter !== "all" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategoryFilter("all")}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading products...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Product Table */}
      <ProductTable
        products={filteredProducts}
        categories={categories}
        loading={loading}
        currentRole={currentRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageVariants={handleManageVariants}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />

      {/* Variant Panel */}
      <Sheet open={isVariantPanelOpen} onOpenChange={setIsVariantPanelOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedProductForVariants?.name}</SheetTitle>
            <p className="text-sm text-gray-500 mt-1">
              {selectedProductForVariants?.description}
            </p>
          </SheetHeader>
          <div className="mt-6">
            <VariantManagementPanel product={selectedProductForVariants} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Create/Edit Dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        existingImages={selectedProduct?.images || []}
        loading={isSaving}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedProduct={selectedProduct}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
