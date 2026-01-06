"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "./address-card";
import { searchAddress } from "@/lib/opencage/opencage";
import dynamic from "next/dynamic";
import { reverseGeocode } from "@/lib/opencage/reverse";
import { MapPin, X, Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);
  
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
    !!form.label?.trim() &&
    !!form.recipientName?.trim() &&
    !!form.phone?.trim() &&
    !!form.addressLine?.trim() &&
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

  const handleSelectSuggestion = (s: AddressSuggestion) => {
    isSelectingRef.current = true;
    
    setForm((p) => ({
      ...p,
      addressLine: s.label,
      latitude: s.latitude,
      longitude: s.longitude,
    }));
    setSuggestions([]);
    setShowMap(true);
  };

  const handleSave = async () => {
    if (!isValid) return;
    
    setLoading(true);
    try {
      onSave(form);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {initialData ? "Edit Address" : "Add New Address"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Fill in the details below
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Address Label */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Address Label <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Home, Office, Apartment"
              value={form.label ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              className="border-slate-300 focus-visible:ring-primary/20"
            />
          </div>

          {/* Recipient Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Recipient Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Full name of recipient"
              value={form.recipientName ?? ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  recipientName: e.target.value,
                }))
              }
              className="border-slate-300 focus-visible:ring-primary/20"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. +62 812-3456-7890"
              value={form.phone ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="border-slate-300 focus-visible:ring-primary/20"
            />
          </div>

          {/* Full Address with Autocomplete */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Full Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Start typing to search address..."
                value={form.addressLine ?? ""}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="border-slate-300 focus-visible:ring-primary/20"
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute z-50 bg-white border border-slate-200 rounded-lg mt-2 w-full max-h-60 overflow-auto shadow-lg">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 transition-colors border-b border-slate-100 last:border-0"
                      onClick={() => handleSelectSuggestion(s)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{s.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Type at least 4 characters to see suggestions
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Additional Notes <span className="text-slate-400">(Optional)</span>
            </Label>
            <Input
              placeholder="e.g. Floor 5, Unit A, Near the elevator"
              value={form.notes ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="border-slate-300 focus-visible:ring-primary/20"
            />
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
                  Drag the marker to set exact coordinates
                </p>
              </div>
            </label>
          </div>

          {/* Map Container */}
          {showMap && (
            <div className="space-y-3">
              <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
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
              
              {/* Coordinate Info */}
              {form.latitude && form.longitude && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-blue-900">Coordinates Selected</p>
                      <p className="text-xs text-blue-700 mt-0.5 font-mono">
                        {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary Address Toggle */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.isPrimary}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    isPrimary: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary/20 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-slate-700">
                  Set as default address
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  This will be your primary delivery address
                </p>
              </div>
            </label>
          </div>

          {/* Required Fields Note */}
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-800">
              <span className="font-medium">Note:</span> Fields marked with{" "}
              <span className="text-red-500">*</span> are required
            </p>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || loading}
            className="min-w-[120px] shadow-sm hover:shadow-md transition-shadow"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Address"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}