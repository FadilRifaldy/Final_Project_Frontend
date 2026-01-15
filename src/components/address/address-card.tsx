"use client";

import { MapPin, Edit, Trash2, Star, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  
  // Address Details
  street: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  addressLine: string;
  
  // Coordinates
  latitude: number;
  longitude: number;
  
  // Additional
  notes?: string | null;
  isPrimary: boolean;
  
  // Timestamps
  createdAt?: Date | string;
  updatedAt?: Date | string;
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
    <div className="relative border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2.5 bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                {address.label}
              </h4>
              {address.isPrimary && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-0 h-5">
                  <Star className="w-3 h-3 mr-1 fill-green-700" />
                  Primary
                </Badge>
              )}
            </div>
            
            {/* Recipient Info - Moved inside header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{address.recipientName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>{address.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 flex-shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(address)}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(address.id)}
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Address Line - No longer indented */}
      <div className="pl-10 sm:pl-12">
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {address.addressLine}
        </p>
        {address.notes && (
          <p className="text-xs text-slate-500 mt-1.5 italic">
            Note: {address.notes}
          </p>
        )}
      </div>

      {/* Set Primary Button */}
      {!address.isPrimary && (
        <div className="pl-10 sm:pl-12 pt-3.5 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetPrimary(address.id)}
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <Star className="w-3 h-3 mr-1.5" />
            Set as Primary
          </Button>
        </div>
      )}
    </div>
  );
}