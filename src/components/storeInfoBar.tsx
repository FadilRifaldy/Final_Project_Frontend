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
    <div className="w-full border-b bg-muted/40 py-3">
      <div className="container mx-auto flex items-center justify-center text-sm text-foreground">
        {/* LEFT: User Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <LocateFixed className="w-4 h-4 text-blue-600" />
          <span>{userLocation}</span>
        </div>

        {/* CENTER: Divider (optional, bisa dihapus jika tidak mau) */}
        <div className="hidden md:block w-px h-5 bg-border mx-4"></div>

        {/* RIGHT: Nearest Store Info */}
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-muted-foreground">Showing products from</span>
          <div className="flex items-center gap-1 font-medium text-green-700">
            <MapPin className="w-4 h-4" />
            <span>{storeName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
