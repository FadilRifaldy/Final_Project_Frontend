"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "./address-card";
import { searchAddress } from "@/lib/opencage/opencage";
import dynamic from "next/dynamic";
import { reverseGeocode } from "@/lib/opencage/reverse";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Address>) => void;
  initialData?: Address | null;
}

interface AddressSuggestion {
  label: string;
  latitude: number;
  longitude: number;
}

const emptyForm: Partial<Address> = {
  label: "",
  recipientName: "",
  phone: "",
  addressLine: "",
  notes: "",
  isPrimary: false,
  latitude: undefined,
  longitude: undefined,
};

const AddressMap = dynamic(() => import("./address-map"), { ssr: false });

export function AddressModal({ open, onClose, onSave, initialData }: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showMap, setShowMap] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [form, setForm] = useState<Partial<Address>>(() => {
    if (initialData) return initialData;

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_location");
      if (saved) {
        const geo = JSON.parse(saved);
        return {
          ...emptyForm,
          addressLine: geo.addressLine,
          latitude: geo.latitude,
          longitude: geo.longitude,
          city: geo.city,
          district: geo.district,
          province: geo.province,
          postalCode: geo.postalCode,
        };
      }
    }

    return emptyForm;
  });

  if (!open) return null;

  const isValid =
    !!form.label &&
    !!form.recipientName &&
    !!form.phone &&
    !!form.addressLine &&
    form.addressLine.trim().length >= 3;

  const handleAddressChange = (value: string) => {
    setForm((p) => ({ ...p, addressLine: value }));

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 4) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const res = await searchAddress(value);
      setSuggestions(res);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 relative">
        <h2 className="text-lg font-semibold">
          {initialData ? "Edit Address" : "Add Address"}
        </h2>
        <div className="space-y-2">
          <Label>Address Label</Label>

          <Input
            placeholder="Home, Office, etc."
            value={form.label ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Recipient Name</Label>

          <Input
            placeholder="Full name"
            value={form.recipientName ?? ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                recipientName: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>

          <Input
            placeholder="e.g. +62 8xxxxxxxxxx"
            value={form.phone ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Full Address</Label>

          <div className="relative">
            <Input
              placeholder="Street, city, province, postal code"
              value={form.addressLine ?? ""}
              onChange={(e) => handleAddressChange(e.target.value)}
            />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-50 bg-white border rounded-md mt-1 w-full max-h-48 overflow-auto">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setForm((p) => ({
                      ...p,
                      addressLine: s.label,
                      latitude: s.latitude,
                      longitude: s.longitude,
                    }));
                    setSuggestions([]);
                    setShowMap(true);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Additional Notes (optional)</Label>
          <Input
            placeholder="Apartment, floor, delivery instructions"
            value={form.notes ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showMap}
            onChange={(e) => setShowMap(e.target.checked)}
            className="cursor-pointer"
          />
          <span>Select location on map</span>
        </label>

        {showMap && (
          <div className="border rounded-lg overflow-hidden">
            <AddressMap
              latitude={form.latitude}
              longitude={form.longitude}
              onPick={async (lat, lng) => {
                const geo = await reverseGeocode(lat, lng);

                setForm((p) => ({
                  ...p,
                  latitude: lat,
                  longitude: lng,
                  addressLine: geo.addressLine,
                  city: geo.city,
                  district: geo.district,
                  province: geo.province,
                  postalCode: geo.postalCode,
                }));
              }}
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.isPrimary}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                isPrimary: e.target.checked,
              }))
            }
          />
          Set as default address
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className="cursor-pointer"
            disabled={!isValid}
            onClick={() => {
              onSave(form);
              onClose();
            }}
          >
            Save Address
          </Button>
        </div>
      </div>
    </div>
  );
}
