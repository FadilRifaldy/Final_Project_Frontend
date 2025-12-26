"use client";

import { MapPin, CheckCircle, LocateFixed } from "lucide-react";
import { useState, useEffect } from "react";

export default function StoreInfoBar({ storeName = "FreshMart East" }) {
  // Dummy user location -> nanti diganti dengan real geolocation
  const [userLocation, setUserLocation] = useState("Your Location");

  // Kalau nanti mau aktifkan geolocation:
  /*
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
      },
      () => setUserLocation("Unknown Location")
    );
  }, []);
  */

  return (
    <div className="sticky top-20 z-40 w-full border-b bg-muted/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-2 text-sm text-foreground md:flex-row md:items-center md:justify-center">
          
          {/* User Location */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
            <LocateFixed className="h-4 w-4 text-blue-600" />
            <span className="truncate">{userLocation}</span>
          </div>

          {/* Divider */}
          <div className="hidden h-5 w-px bg-border md:block md:mx-4" />

          {/* Store Info */}
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-muted-foreground hidden sm:inline">
              Showing products from
            </span>
            <div className="flex items-center gap-1 font-medium text-green-700">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{storeName}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
