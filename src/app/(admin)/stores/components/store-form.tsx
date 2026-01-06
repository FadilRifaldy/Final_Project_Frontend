"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { IStore } from "@/types/store";
import { IOpenCageSuggestion } from "@/types/opencage";
import { createStore, updateStore } from "@/lib/helpers/store.backend";
import { searchAddressRaw } from "@/lib/opencage/opencage-raw";

export interface StoreFormDialogProps {
  open: boolean;
  store?: IStore | null;
  onClose: () => void;
  onSuccess: (store: IStore) => void;
}

const emptyForm: Partial<IStore> = {
  name: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  latitude: 0,
  longitude: 0,
  phone: "",
  maxServiceRadius: 10,
  isActive: true,
};

export function StoreFormDialog({
  open,
  store,
  onClose,
  onSuccess,
}: StoreFormDialogProps) {
  const [loading, setLoading] = useState(false);
  
  const [query, setQuery] = useState(store?.address ?? "");
  const [suggestions, setSuggestions] = useState<IOpenCageSuggestion[]>([]);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  const [form, setForm] = useState<Partial<IStore>>(() => {
    if (store) {
      return {
        name: store.name,
        address: store.address,
        city: store.city,
        province: store.province,
        postalCode: store.postalCode,
        latitude: store.latitude,
        longitude: store.longitude,
        phone: store.phone,
        maxServiceRadius: store.maxServiceRadius,
        isActive: store.isActive,
      };
    }
    return emptyForm;
  });

  if (!open) return null;

  const isValid = !!form.name?.trim() && !!form.address?.trim();

  const handleAddressChange = (value: string) => {
    setQuery(value);
    setForm((prev) => ({ ...prev, address: value }));

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchAddressRaw(value);
      setSuggestions(results);
    }, 400);
  };

  const handleSelectAddress = (item: IOpenCageSuggestion) => {
    const c = item.components;
    isSelectingRef.current = true;

    setForm((prev) => ({
      ...prev,
      address: item.formatted,
      city: c.city || c.town || c.village || "",
      province: c.state || "",
      postalCode: c.postcode || "",
      latitude: item.geometry.lat,
      longitude: item.geometry.lng,
    }));

    setQuery(item.formatted);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!form.name?.trim() || !form.address?.trim()) {
      toast.error("Name dan address wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = store 
        ? await updateStore(store.id, form as Partial<IStore>)
        : await createStore(form);

      if (!res.success || !res.data) {
        toast.error(res.message || "Gagal menyimpan store");
        setLoading(false);
        return;
      }

      onSuccess(res.data);
      setLoading(false);
      
      setForm(emptyForm);
      setQuery("");
      setSuggestions([]);
    } catch (error) {
      toast.error("Terjadi kesalahan");
      console.error(error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    setQuery("");
    setSuggestions([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {store ? "Edit Store" : "Create Store"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Store Name */}
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input
              placeholder="e.g. Main Branch, Outlet 1"
              value={form.name ?? ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <div className="relative">
              <Input
                placeholder="Cari alamat..."
                value={query}
                onChange={(e) => handleAddressChange(e.target.value)}
              />

              {suggestions.length > 0 && (
                <div className="absolute z-50 bg-white border rounded-md mt-1 w-full max-h-48 overflow-auto shadow-lg">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAddress(item)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {item.formatted}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* City & Province */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                placeholder="City"
                value={form.city ?? ""}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Province</Label>
              <Input
                placeholder="Province"
                value={form.province ?? ""}
                onChange={(e) =>
                  setForm({ ...form, province: e.target.value })
                }
              />
            </div>
          </div>

          {/* Postal Code & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Postal Code</Label>
              <Input
                placeholder="e.g. 40191"
                value={form.postalCode ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    postalCode: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                placeholder="e.g. +62 8xx"
                value={form.phone ?? ""}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Max Service Radius */}
          <div className="space-y-2">
            <Label>Max Service Radius (KM)</Label>
            <Input
              type="number"
              placeholder="10"
              value={form.maxServiceRadius ?? 10}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxServiceRadius: parseInt(e.target.value) || 10,
                })
              }
            />
          </div>

          {/* Is Active Checkbox */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) =>
                setForm({
                  ...form,
                  isActive: e.target.checked,
                })
              }
              className="cursor-pointer"
            />
            <span>Store is active</span>
          </label>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className="cursor-pointer"
            >
              {loading ? "Saving..." : "Save Store"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}