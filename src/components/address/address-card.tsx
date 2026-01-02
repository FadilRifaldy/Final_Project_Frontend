"use client";

import { MapPin, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  street: string;
  notes?: string | null;
  isPrimary: boolean;
  latitude: number;
  longitude: number;
}

interface Props {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetPrimary,
}: Props) {
  return (
    <div className="border rounded-xl p-4 space-y-2 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <MapPin size={16} />
            <Label>{address.label}</Label>
            {address.isPrimary && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Star size={12} /> Primary
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {address.recipientName} • {address.phone}
          </p>
        </div>

        <div className="flex gap-1">
          <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => onEdit(address)}>
            <Edit size={16} />
          </Button>
          <Button
            className="cursor-pointer"
            size="icon"
            variant="ghost"
            onClick={() => onDelete(address.id)}
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </div>
      </div>

      <p className="text-sm">{address.addressLine}</p>

      {!address.isPrimary && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSetPrimary(address.id)}
        >
          Set as Primary
        </Button>
      )}
    </div>
  );
}
