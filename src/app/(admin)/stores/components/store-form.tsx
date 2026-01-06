"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { IStore } from "@/types/store";
import { createStore } from "@/lib/helpers/store.backend";

/* ================================
   PROPS TYPE (🔥 INI KUNCI FIX ERROR)
================================ */
export interface StoreFormDialogProps {
  open: boolean;
  store?: IStore | null; // ✅ SEKARANG ADA
  onClose: () => void;
  onSuccess: (store: IStore) => void;
}

/* ================================
   COMPONENT
================================ */
export function StoreFormDialog({
  open,
  store,
  onClose,
  onSuccess,
}: StoreFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: store?.name ?? "",
    address: store?.address ?? "",
    city: store?.city ?? "",
    province: store?.province ?? "",
    postalCode: store?.postalCode ?? "",
    latitude: store?.latitude ?? 0,
    longitude: store?.longitude ?? 0,
    phone: store?.phone ?? "",
    maxServiceRadius: store?.maxServiceRadius ?? 5,
    isActive: store?.isActive ?? true,
  });

  const handleSubmit = async () => {
    setLoading(true);

    const res = await createStore(form);

    if (!res.success || !res.data) {
      toast.error(res.message || "Gagal membuat store");
      setLoading(false);
      return;
    }

    onSuccess(res.data); // ✅ BALIK KE PAGE
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {store ? "Edit Store" : "Create Store"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Store Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <Input
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
          <Input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />
          <Input
            placeholder="Province"
            value={form.province}
            onChange={(e) =>
              setForm({ ...form, province: e.target.value })
            }
          />
          <Input
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={(e) =>
              setForm({ ...form, postalCode: e.target.value })
            }
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Store"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
