"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { IProduct } from "@/types/product";
import { useProductStore } from "@/lib/store/productStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductDialog } from "@/components/products/ProductDialog";
import { DeleteProductDialog } from "@/components/products/DeleteProductDialog";

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
  const [isActive, setIsActive] = useState(true);

  // Ambil data dan functions dari Zustand stores
  const {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();

  // Fetch data saat component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Handler untuk create button
  const handleCreate = () => {
    setDialogMode("create");
    setSelectedProduct(null);
    setName("");
    setDescription("");
    setCategoryId("");
    setIsActive(true);
    setDialogOpen(true);
  };

  // Handler untuk edit button
  const handleEdit = (product: IProduct) => {
    setDialogMode("edit");
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategoryId(product.categoryId);
    setIsActive(product.isActive);
    setDialogOpen(true);
  };

  // Handler untuk delete button
  const handleDelete = (product: IProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // Handler untuk manage variants button
  const handleManageVariants = (product: IProduct) => {
    router.push(`/products/variants?productId=${product.id}`);
  };

  // Konfirmasi delete
  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
    }
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  // Handler untuk save (create atau update)
  const handleSave = () => {
    if (dialogMode === "create") {
      addProduct(name, description, categoryId, []);
    } else if (dialogMode === "edit" && selectedProduct) {
      updateProduct(
        selectedProduct.id,
        name,
        description,
        categoryId,
        [],
        isActive
      );
    }
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        {currentRole === "SUPER_ADMIN" && (
          <Button onClick={handleCreate}>Add Product</Button>
        )}
      </div>

      {/* Loading state */}
      {loading && <p className="text-muted-foreground">Loading...</p>}

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Product Table */}
      <ProductTable
        products={products}
        categories={categories}
        loading={loading}
        currentRole={currentRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageVariants={handleManageVariants}
      />

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
        isActive={isActive}
        setIsActive={setIsActive}
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
