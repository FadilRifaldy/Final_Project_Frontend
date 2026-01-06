"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  MapPin,
  Phone,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

import { StoreFormDialog } from "./components/store-form";
import { IStore } from "@/types/store";

export default function StoreManagementPage() {
  const [stores, setStores] = useState<IStore[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = () => {
    setSelectedStore(null);
    setShowModal(true);
  };

  const handleEdit = (store: IStore) => {
    toast.info("Edit store belum diimplementasikan");
    setSelectedStore(store);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const storeToDelete = stores.find((s) => s.id === id);

    setStores((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);

    if (storeToDelete) {
      toast.success("Store deleted", {
        description: `"${storeToDelete.name}" telah dihapus`,
      });
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Store Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua toko Anda
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Store
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Radius</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Building2 className="mx-auto mb-2 text-muted-foreground" />
                  No stores found
                </TableCell>
              </TableRow>
            ) : (
              filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <div className="font-medium">{store.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {store.address}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 mt-1" />
                      <div>
                        <div>{store.city}</div>
                        <div className="text-xs text-muted-foreground">
                          {store.province}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Phone className="inline h-4 w-4 mr-1" />
                    {store.phone || "-"}
                  </TableCell>

                  <TableCell>{store.maxServiceRadius} KM</TableCell>

                  <TableCell>
                    <Badge
                      variant={store.isActive ? "default" : "secondary"}
                    >
                      {store.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(store)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(store.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <StoreFormDialog
        open={showModal}
        store={selectedStore}
        onClose={() => setShowModal(false)}
        onSuccess={(store) => {
          setStores((prev) => [...prev, store]); // ✅ aman TS
          setShowModal(false);

          toast.success("Store created", {
            description: `"${store.name}" berhasil ditambahkan`,
          });
        }}
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store?</AlertDialogTitle>
            <AlertDialogDescription>
              Store ini akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
