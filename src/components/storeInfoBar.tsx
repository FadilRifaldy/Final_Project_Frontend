"use client";

import { MapPin, CheckCircle, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import { reverseGeocode } from "@/lib/opencage/reverse";

export default function StoreInfoBar({ storeName = "FreshMart East" }) {
  const [userLocation, setUserLocation] = useState("Your Location");

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const geo = await reverseGeocode(latitude, longitude);

          setUserLocation(`${geo.city}, ${geo.province}`);

          localStorage.setItem("user_location", JSON.stringify(geo));
        } catch {
          setUserLocation("Unknown Location");
          localStorage.removeItem("user_location");
        }
      },
      () => {
        setUserLocation("Location access denied");
        localStorage.removeItem("user_location"); 
      }
    );
  }, []);

  useEffect(() => {
  if (!navigator.permissions) return;

  navigator.permissions
    .query({ name: "geolocation" as PermissionName })
    .then((permission) => {
      permission.onchange = () => {
        if (permission.state !== "granted") {
          localStorage.removeItem("user_location");
          setUserLocation("Your Location");
        }
      };
    });
}, []);

  return (
    <div className="sticky top-20 z-40 w-full border-b bg-muted/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-2 text-sm md:flex-row md:justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <LocateFixed className="h-4 w-4 text-blue-600" />
            <span className="truncate">{userLocation}</span>
          </div>

          <div className="hidden h-5 w-px bg-border md:block md:mx-4" />

          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="hidden sm:inline text-muted-foreground">
              Showing products from
            </span>
            <div className="flex items-center gap-1 font-medium text-green-700">
              <MapPin className="h-4 w-4" />
              <span>{storeName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
