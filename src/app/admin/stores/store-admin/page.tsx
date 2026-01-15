"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  getStoreAdmins,
  getAvailableStores,
  assignStoreToAdmin,
  unassignStoreFromAdmin,
  IStoreAdmin,
  IAvailableStore,
} from "@/lib/helpers/assign-store-admin.backend";
import { AssignStoreAdminHeader } from "@/components/store-admin/assign-store-admin-header";
import { StoreAdminTable } from "@/components/store-admin/store-admin-table";
import { StoreAdminCards } from "@/components/store-admin/store-admin-card";
import { AssignDialog } from "@/components/store-admin/assignn-dialog";
import { UnassignDialog } from "@/components/store-admin/unassign-dialog";

export default function AssignStoreAdminPage() {
  const [storeAdmins, setStoreAdmins] = useState<IStoreAdmin[]>([]);
  const [availableStores, setAvailableStores] = useState<IAvailableStore[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<IStoreAdmin | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showUnassignDialog, setShowUnassignDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsRes, storesRes] = await Promise.all([
        getStoreAdmins(),
        getAvailableStores(),
      ]);

      if (adminsRes.success && adminsRes.data) {
        setStoreAdmins(adminsRes.data);
      } else {
        toast.error(adminsRes.message);
      }

      if (storesRes.success && storesRes.data) {
        setAvailableStores(storesRes.data);
      } else {
        toast.error(storesRes.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (admin: IStoreAdmin) => {
    setSelectedAdmin(admin);
    setSelectedStoreId(admin.storeId || "");
    setShowAssignDialog(true);
  };

  const handleUnassignClick = (admin: IStoreAdmin) => {
    setSelectedAdmin(admin);
    setShowUnassignDialog(true);
  };

  const handleAssign = async () => {
    if (!selectedAdmin || !selectedStoreId) return;

    setAssignLoading(selectedAdmin.id);
    try {
      const res = await assignStoreToAdmin(selectedAdmin.id, selectedStoreId);

      if (!res.success || !res.data) {
        toast.error(res.message);
        return;
      }

      setStoreAdmins((prev) =>
        prev.map((admin) =>
          admin.id === selectedAdmin.id ? res.data! : admin
        )
      );

      toast.success("Store assigned", {
        description: `${selectedAdmin.name} berhasil di-assign ke store`,
      });

      setShowAssignDialog(false);
      setSelectedAdmin(null);
      setSelectedStoreId("");
    } catch (error) {
      toast.error("Terjadi kesalahan saat assign store");
      console.error(error);
    } finally {
      setAssignLoading(null);
    }
  };

  const handleUnassign = async () => {
    if (!selectedAdmin) return;

    setAssignLoading(selectedAdmin.id);
    try {
      const res = await unassignStoreFromAdmin(selectedAdmin.id);

      if (!res.success || !res.data) {
        toast.error(res.message);
        return;
      }

      setStoreAdmins((prev) =>
        prev.map((admin) =>
          admin.id === selectedAdmin.id
            ? { ...admin, storeId: null, store: null }
            : admin
        )
      );

      toast.success("Store unassigned", {
        description: `${selectedAdmin.name} berhasil di-unassign dari store`,
      });

      setShowUnassignDialog(false);
      setSelectedAdmin(null);
    } catch (error) {
      toast.error("Terjadi kesalahan saat unassign store");
      console.error(error);
    } finally {
      setAssignLoading(null);
    }
  };

  const filteredAdmins = storeAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const assignedCount = storeAdmins.filter((a) => a.storeId).length;
  const unassignedCount = storeAdmins.length - assignedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AssignStoreAdminHeader
          totalAdmins={storeAdmins.length}
          assignedCount={assignedCount}
          unassignedCount={unassignedCount}
        />

        {/* Main Content Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Store Admin List</CardTitle>
                <CardDescription className="mt-1">
                  Assign atau unassign store admin ke toko tertentu
                </CardDescription>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-slate-200 focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <StoreAdminTable
              admins={filteredAdmins}
              loading={loading}
              assignLoading={assignLoading}
              searchQuery={searchQuery}
              onAssignClick={handleAssignClick}
              onUnassignClick={handleUnassignClick}
            />

            <StoreAdminCards
              admins={filteredAdmins}
              loading={loading}
              assignLoading={assignLoading}
              searchQuery={searchQuery}
              onAssignClick={handleAssignClick}
              onUnassignClick={handleUnassignClick}
            />
          </CardContent>
        </Card>
      </div>

      <AssignDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        selectedAdmin={selectedAdmin}
        selectedStoreId={selectedStoreId}
        availableStores={availableStores}
        assignLoading={assignLoading}
        onStoreChange={setSelectedStoreId}
        onConfirm={handleAssign}
      />

      <UnassignDialog
        open={showUnassignDialog}
        onOpenChange={setShowUnassignDialog}
        selectedAdmin={selectedAdmin}
        assignLoading={assignLoading}
        onConfirm={handleUnassign}
      />
    </div>
  );
}