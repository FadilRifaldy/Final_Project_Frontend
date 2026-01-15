"use client";

import { useState, useRef } from "react";
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
import { MapPin, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

import { IStore } from "@/types/store";
import { IOpenCageSuggestion } from "@/types/opencage";
import { createStore, updateStore } from "@/lib/helpers/store.backend";
import { searchAddressRaw } from "@/lib/opencage/opencage-raw";
import { reverseGeocode } from "@/lib/opencage/reverse";

// Dynamic import for map component (client-side only)
const MapPicker = dynamic(() => import("@/components/address/address-map"), { ssr: false });

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
  const [showMap, setShowMap] = useState(false);
  
  const [query, setQuery] = useState(store?.address ?? "");
  const [suggestions, setSuggestions] = useState<IOpenCageSuggestion[]>([]);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  const [form, setForm] = useState<Partial<IStore>>(() => {
    if (store) {
      // Auto-show map if editing and has coordinates
      if (store.latitude && store.longitude && store.latitude !== 0 && store.longitude !== 0) {
        setShowMap(true);
      }
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
  const hasValidCoordinates = !!form.latitude && !!form.longitude && form.latitude !== 0 && form.longitude !== 0;

  const handleAddressChange = (value: string) => {
    setQuery(value);
    
    if (!isSelectingRef.current) {
      setForm((prev) => ({ 
        ...prev, 
        address: value,
        latitude: 0,
        longitude: 0,
        city: "",
        province: "",
        postalCode: ""
      }));
    } else {
      isSelectingRef.current = false;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchAddressRaw(value);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
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
    setShowMap(true); // Auto-show map after selection
  };

  const handleMapPick = async (lat: number, lng: number) => {
    try {
      console.log("📍 Map clicked:", { lat, lng });
      
      const loadingToast = toast.loading("Mencari alamat...");
      
      const geo = await reverseGeocode(lat, lng);
      
      toast.dismiss(loadingToast);
      
      setForm((prev) => ({
        ...prev,
        address: geo.addressLine,
        city: geo.city,
        province: geo.province,
        postalCode: geo.postalCode,
        latitude: lat,
        longitude: lng,
      }));

      setQuery(geo.addressLine);
      
      if (geo.city) {
        toast.success("Lokasi berhasil dipilih", {
          description: `${geo.city}, ${geo.province}`
        });
      } else {
        toast.info("Koordinat tersimpan", {
          description: "Silakan isi city dan province secara manual"
        });
      }
    } catch (error) {
      console.error("❌ Error in handleMapPick:", error);
      
      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
      }));
      
      setQuery(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      
      toast.warning("Gagal mendapatkan alamat lengkap", {
        description: "Koordinat tersimpan, silakan isi alamat manual"
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.name?.trim() || !form.address?.trim()) {
      toast.error("Name dan address wajib diisi");
      return;
    }

    // ✅ Validate city and province
    if (!form.city?.trim() || !form.province?.trim()) {
      toast.error("City dan Province wajib diisi", {
        description: "Silakan lengkapi data alamat"
      });
      return;
    }

    if (!hasValidCoordinates) {
      toast.error("Pilih alamat dari daftar suggestion atau map", {
        description: "Koordinat GPS diperlukan untuk menentukan lokasi toko"
      });
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

      toast.success(
        store ? "Store berhasil diupdate" : "Store berhasil dibuat",
        {
          description: `${res.data.name} - ${res.data.city}, ${res.data.province}`
        }
      );

      onSuccess(res.data);
      setLoading(false);
      
      setForm(emptyForm);
      setQuery("");
      setSuggestions([]);
      setShowMap(false);
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
    setShowMap(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {store ? "Edit Store" : "Create Store"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Store Name */}
          <div className="space-y-2">
            <Label>Store Name *</Label>
            <Input
              placeholder="e.g. Main Branch, Outlet 1"
              value={form.name ?? ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Address with Autocomplete */}
          <div className="space-y-2">
            <Label>Address *</Label>
            <div className="relative">
              <Input
                placeholder="Cari alamat... (minimal 3 karakter)"
                value={query}
                onChange={(e) => handleAddressChange(e.target.value)}
                className={!hasValidCoordinates && query ? "border-orange-300" : ""}
              />

              {suggestions.length > 0 && (
                <div className="absolute z-50 bg-white border rounded-md mt-1 w-full max-h-48 overflow-auto shadow-lg">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAddress(item)}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{item.formatted}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Warning jika belum pilih dari suggestion */}
              {query && !hasValidCoordinates && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md text-xs text-orange-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Pilih alamat dari daftar suggestion atau gunakan map picker untuk mendapatkan koordinat GPS yang akurat
                  </span>
                </div>
              )}

              {/* ✅ UNIFIED Coordinate Info */}
              {hasValidCoordinates && (
                <div className="flex items-center gap-2 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs">
                  <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">Coordinates: </span>
                    <span className="font-mono text-gray-900">
                      {form.latitude?.toFixed(6)}, {form.longitude?.toFixed(6)}
                    </span>
                  </div>
                  {showMap && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Map Toggle */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showMap}
                onChange={(e) => setShowMap(e.target.checked)}
                className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-slate-700">
                  Pin location on map
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on map to set exact coordinates
                </p>
              </div>
            </label>
          </div>

          {/* Map Container */}
          {showMap && (
            <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <MapPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onPick={handleMapPick}
                height={350}
                markerColor="#ef4444"
              />
            </div>
          )}

          {/* City & Province - EDITABLE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                City *
                {form.city && (
                  <span className="text-xs text-green-600 font-normal">
                    (Auto-filled)
                  </span>
                )}
              </Label>
              <Input
                placeholder="e.g. Kota Bandung"
                value={form.city ?? ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={form.city ? "bg-green-50/30" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Province *
                {form.province && (
                  <span className="text-xs text-green-600 font-normal">
                    (Auto-filled)
                  </span>
                )}
              </Label>
              <Input
                placeholder="e.g. Jawa Barat"
                value={form.province ?? ""}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                className={form.province ? "bg-green-50/30" : ""}
              />
            </div>
          </div>

          {/* Postal Code & Phone - EDITABLE */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Postal Code
                {form.postalCode && (
                  <span className="text-xs text-green-600 font-normal">
                    (Auto-filled)
                  </span>
                )}
              </Label>
              <Input
                placeholder="e.g. 40191"
                value={form.postalCode ?? ""}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className={form.postalCode ? "bg-green-50/30" : ""}
                maxLength={5}
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
            <Label>Max Service Radius (KM) *</Label>
            <Input
              type="number"
              min="1"
              max="100"
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
              className="cursor-pointer w-4 h-4"
            />
            <span>Store is active</span>
          </label>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t">
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
              disabled={!isValid || !hasValidCoordinates || loading}
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