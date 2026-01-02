"use client";

import { useEffect, useState } from "react";
import { AddressCard, Address } from "./address-card";
import { AddressModal } from "./address-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapIcon } from "lucide-react";
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
      <div className="flex justify-between items-center">
        <Label className="flex items-center gap-2">
          <MapIcon className="w-4 h-4" />
          My Address
        </Label>
        <Button
          className="cursor-pointer"
          disabled={loading}
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add Address
        </Button>
      </div>

      {addresses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No address yet. Add an address for delivery.
        </p>
      )}

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
