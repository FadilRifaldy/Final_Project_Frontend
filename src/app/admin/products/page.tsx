"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { IProduct } from "@/types/product";
import { Search, X } from "lucide-react";
import { useProductStore } from "@/lib/store/productStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductDialog } from "@/components/products/ProductDialog";
import { DeleteProductDialog } from "@/components/products/DeleteProductDialog";
import { VariantManagementPanel } from "@/components/products/VariantManagementPanel";
import { toast } from "sonner";
import api from "@/lib/api/axios";
import { useProgressBar } from "@/hooks/useProgressBar";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function ProductsPage() {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | "">("");
  const [roleLoading, setRoleLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Local loading state for overall data operations (if needed outside dialog)
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Search state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Variant panel state
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<IProduct | null>(null);
  const [isVariantPanelOpen, setIsVariantPanelOpen] = useState(false);

  // Track if this is the initial mount to prevent double fetch
  const isInitialMount = useRef(true);

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

  // Progress bar using custom hook (after loading is declared)
  const roleProgress = useProgressBar(roleLoading);
  const dataProgress = useProgressBar(loading);

  // Check role and redirect if not SUPER_ADMIN
  // Check role and fetch data if SUPER_ADMIN
  useEffect(() => {
    const checkRoleAndFetchData = async () => {
      try {
        const response = await api.get('/auth/dashboard');
        const userRole = response.data.user.role;

        if (userRole !== 'SUPER_ADMIN') {
          toast.error('Access denied. This page is for Super Admin only.');
          router.push('/dashboard');
          return;
        }

        setCurrentRole(userRole);
        setRoleLoading(false);

        // Fetch data setelah role verified
        fetchProducts();
        fetchCategories();
      } catch (error) {
        toast.error("Unauthorized access");
        router.push('/admin/dashboard');
        setRoleLoading(false);
      }
    };

    checkRoleAndFetchData();
  }, [router, fetchProducts, fetchCategories]);

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
    // Skip the first render (initial mount) because fetchProducts is already called in the currentRole useEffect
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

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
    setDialogOpen(true);
  };

  // Handler untuk edit button
  const handleEdit = (product: IProduct) => {
    setDialogMode("edit");
    setSelectedProduct(product);
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

  // Handler untuk save (create atau update) - Passed to ProductDialog
  const handleSave = async (data: { name: string; description: string; categoryId: string; files: File[] }) => {
    try {
      if (dialogMode === "create") {
        // 1. Create product first
        const createdProduct = await addProduct(data.name, data.description, data.categoryId, []);

        // 2. Upload images if any
        if (createdProduct && data.files.length > 0) {
          await uploadProductImages(createdProduct.id, data.files);
        }
        toast.success("Product created successfully!");
      } else if (dialogMode === "edit" && selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.id, data.name, data.description, data.categoryId, []);
        if (updatedProduct && data.files.length > 0) {
          await uploadProductImages(updatedProduct.id, data.files);
        }
        toast.success("Product updated successfully!");
      }

      // Refresh data
      fetchProducts(currentPage, itemsPerPage);
    } catch (error) {
      console.error("Error saving product:", error);
      throw error; // Let the hook handled by the dialog handle the loading state
    }
  };

  // Show loading while checking role - CRITICAL: prevent rendering before role verification
  if (roleLoading) {
    return <LoadingScreen progress={roleProgress} message="Checking access..." />;
  }

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
      {loading && <LoadingScreen progress={dataProgress} message="Loading products..." />}

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Product Table */}
      {!loading && (
        <ProductTable
          products={filteredProducts}
          categories={categories}
          currentRole={currentRole as "SUPER_ADMIN" | "STORE_ADMIN"}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManageVariants={handleManageVariants}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}

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
        initialProduct={selectedProduct}
        categories={categories}
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