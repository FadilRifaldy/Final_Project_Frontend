"use client";

import { useEffect, useState } from "react";
import { AddressCard, Address } from "./address-card";
import { AddressModal } from "./address-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Plus, Package } from "lucide-react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
} from "@/lib/helpers/address.backend";

export default function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAddresses().then((res) => {
      if (res.success && res.data) {
        setAddresses(res.data);
      }
    });
  }, []);

  const handleSave = async (data: Partial<Address>) => {
    setLoading(true);

    const payload = {
      label: data.label!,
      recipientName: data.recipientName!,
      phone: data.phone!,
      addressLine: data.addressLine!,
      street: data.street!,
      city: data.city!,
      district: data.district || "",
      province: data.province!,
      postalCode: data.postalCode || "",
      latitude: data.latitude!,
      longitude: data.longitude!,
      notes: data.notes,
      isPrimary: data.isPrimary ?? false,
    };

    if (data.id) {
      const res = await updateAddress(data.id, payload);
      if (res.success && res.data) {
        toast.success("Alamat berhasil diperbarui");
        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            isPrimary: res.data!.isPrimary
              ? a.id === res.data!.id
              : a.isPrimary,
          }))
        );
      } else {
        toast.error("Gagal memperbarui alamat");
      }
    } else {
      const res = await createAddress(payload);
      if (res.success && res.data) {
        toast.success("Alamat berhasil ditambahkan");
        setAddresses((prev) =>
          res.data!.isPrimary
            ? prev.map((a) => ({ ...a, isPrimary: false })).concat(res.data!)
            : [...prev, res.data!]
        );
      } else {
        toast.error("Gagal menambahkan alamat");
      }
    }

    await getAddresses().then((res) => {
      if (res.success && res.data) {
        setAddresses(res.data);
      }
    });

    setLoading(false);
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteAddress(id);
    if (res.success) {
      toast.success("Alamat berhasil dihapus");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } else {
      toast.error("Gagal menghapus alamat");
    }
  };

  const handleSetPrimary = async (id: string) => {
    const res = await setPrimaryAddress(id);
    if (res.success) {
      toast.success("Alamat utama berhasil diperbarui");
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isPrimary: a.id === id,
        }))
      );
    } else {
      toast.error("Gagal mengatur alamat utama");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </div>
          <div className="pl-0.5 sm:pl-1">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              My Addresses
            </h3>
            <p className="text-xs text-slate-500">
              {addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved
            </p>
          </div>
        </div>

        <Button
          disabled={loading}
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow text-sm h-9 sm:h-10"
        >
          <Plus className="mr-1.5 sm:mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Address
        </Button>
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="p-3 sm:p-4 bg-slate-100 rounded-full mb-3 sm:mb-4">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
          </div>
          <h4 className="text-sm sm:text-base font-medium text-slate-700 mb-1">
            No addresses yet
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 text-center mb-4">
            Add your first delivery address to get started
          </p>
          <Button
            size="sm"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="shadow-sm"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add First Address
          </Button>
        </div>
      )}

      {/* Address List */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(addr) => {
                setSelected(addr);
                setOpen(true);
              }}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddressModal
        key={open ? selected?.id ?? "add-address" : "closed"}
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initialData={selected}
      />
    </div>
  );
}