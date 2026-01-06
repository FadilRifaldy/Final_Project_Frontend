"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Store as StoreIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { StoreFormDialog } from "./components/store-form";
import { IStore } from "@/types/store";
import {
  updateStore,
  createStore,
  getStores,
  deleteStore,
} from "@/lib/helpers/store.backend";

export default function StoreManagementPage() {
  const [stores, setStores] = useState<IStore[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const res = await getStores();
        if (!res.success || !res.data) {
          toast.error(res.message || "Gagal mengambil store");
          return;
        }
        setStores(res.data);
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleCreate = () => {
    setSelectedStore(null);
    setShowModal(true);
  };

  const handleEdit = (store: IStore) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  const handleSave = async (storeData: IStore) => {
    try {
      if (selectedStore) {
        setStores((prev) =>
          prev.map((store) =>
            store.id === selectedStore.id ? storeData : store
          )
        );
        toast.success("Store updated", {
          description: `"${storeData.name}" berhasil diperbarui`,
        });
      } else {
        setStores((prev) => [storeData, ...prev]);
        toast.success("Store created", {
          description: `"${storeData.name}" berhasil ditambahkan`,
        });
      }

      setShowModal(false);
      setSelectedStore(null);
    } catch (error) {
      toast.error("Terjadi kesalahan");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const storeToDelete = stores.find((s) => s.id === deleteId);
    setDeleteLoading(true);
    try {
      const res = await deleteStore(deleteId);
      if (!res.success) {
        toast.error(res.message || "Gagal menghapus store");
        return;
      }
      setStores((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
      if (storeToDelete) {
        toast.success("Store deleted", {
          description: `"${storeToDelete.name}" telah dihapus`,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus store");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <StoreIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Store Management
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Kelola semua toko Anda dengan mudah
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleCreate} 
            className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Store
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Stores</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stores.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Stores</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stores.filter((s) => s.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <StoreIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Inactive Stores</p>
                  <p className="text-2xl font-bold text-slate-600 mt-1">
                    {stores.filter((s) => !s.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">
                  <StoreIcon className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Store List</CardTitle>
                <CardDescription className="mt-1">
                  Manage and monitor all your store locations
                </CardDescription>
              </div>
              
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by store name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-slate-200 focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Table - Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-700">Store</TableHead>
                    <TableHead className="font-semibold text-slate-700">Location</TableHead>
                    <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-700">Service Radius</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm text-slate-500">Loading stores...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredStores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-4 bg-slate-50 rounded-full">
                            <Building2 className="h-8 w-8 text-slate-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">No stores found</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {searchQuery ? "Try adjusting your search" : "Get started by creating your first store"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStores.map((store) => (
                      <TableRow 
                        key={store.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Store Name */}
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/5 rounded-lg">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{store.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {store.address}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-700">{store.city}</div>
                              <div className="text-xs text-slate-500">{store.province}</div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700">
                              {store.phone || "-"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Radius */}
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {store.maxServiceRadius} KM
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            variant={store.isActive ? "default" : "secondary"}
                            className={`${
                              store.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {store.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(store)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteId(store.id)}
                              className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Cards - Mobile/Tablet View */}
            <div className="lg:hidden p-4 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-slate-500">Loading stores...</p>
                </div>
              ) : filteredStores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="p-4 bg-slate-50 rounded-full">
                    <Building2 className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">No stores found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery ? "Try adjusting your search" : "Get started by creating your first store"}
                    </p>
                  </div>
                </div>
              ) : (
                filteredStores.map((store) => (
                  <Card key={store.id} className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-primary/5 rounded-lg flex-shrink-0">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {store.name}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {store.address}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={store.isActive ? "default" : "secondary"}
                          className={`flex-shrink-0 text-xs ${
                            store.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {store.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{store.city}, {store.province}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span>{store.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Service Radius:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {store.maxServiceRadius} KM
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(store)}
                          className="flex-1"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteId(store.id)}
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <StoreFormDialog
        key={selectedStore?.id || "create"}
        open={showModal}
        store={selectedStore}
        onClose={() => {
          setShowModal(false);
          setSelectedStore(null);
        }}
        onSuccess={handleSave}
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-full">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg">
                Delete Store?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-slate-600">
              This action cannot be undone. This will permanently delete the store
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              disabled={deleteLoading}
              className="m-0 w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 m-0 w-full sm:w-auto"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Store
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}