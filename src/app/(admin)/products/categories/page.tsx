"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { ICategory } from "@/types/category";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCategoryStore } from "@/lib/store/categoryStore";

export default function CategoriesPage() {
  const [currentRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN">("SUPER_ADMIN");
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedCategory(null);
    setName("");
    setDescription("");
    setDialogOpen(true);
  };

  const handleEdit = (category: ICategory) => {
    setDialogMode("edit");
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setDialogOpen(true);
  };

  const handleDelete = (category: ICategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
    }
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = () => {
    if (dialogMode === "create") {
      addCategory(name, description);
    } else if (dialogMode === "edit") {
      updateCategory(selectedCategory?.id ?? "", name, description);
    }
    setDialogOpen(false);
  };

  // Ambil data dan functions dari Zustand store
  const {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  // Fetch categories saat component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="container mx-auto p-4 w-full md:w-[80%] lg:w-[60%]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        {currentRole === "SUPER_ADMIN" && (
          <Button onClick={handleCreate}>Add Category</Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: ICategory) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                {currentRole === "SUPER_ADMIN" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Add Category" : "Edit Category"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? "Add a new category to the database."
                  : "Make changes to the category."}
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Category Name"
              defaultValue={dialogMode === "edit" ? selectedCategory?.name : ""}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Category Description"
              defaultValue={
                dialogMode === "edit" ? selectedCategory?.description ?? "" : ""
              }
              onChange={(e) => setDescription(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button onClick={handleSave}>
                {dialogMode === "create" ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedCategory && (
              <div className="py-4">
                <p className="text-sm">
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedCategory.name}
                </p>
                {selectedCategory.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCategory.description}
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
