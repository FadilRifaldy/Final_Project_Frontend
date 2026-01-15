"use client";

import { MapPin, CheckCircle, LocateFixed, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { reverseGeocode } from "@/lib/opencage/reverse";
import { getNearestStore } from "@/lib/helpers/store.backend";
import { IStore } from "@/types/store";

export default function StoreInfoBar() {
  const [userLocation, setUserLocation] = useState("Your Location");
  const [nearestStore, setNearestStore] = useState<IStore | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isInRange, setIsInRange] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingStore, setLoadingStore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper: Check if cached data is stale (older than 30 mins)
  const isDataStale = (timestamp: number) => {
    return Date.now() - timestamp > 30 * 60 * 1000;
  };

  const fetchLocationData = async () => {
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      setLoadingStore(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        console.log("🗺️ USER COORDINATES:", {
          latitude,
          longitude,
          accuracy: pos.coords.accuracy
        });

        try {
          // Check cache first to avoid unnecessary geocoding
          const cachedLocation = localStorage.getItem("user_location");
          let shouldGeocode = true;

          if (cachedLocation) {
            const parsed = JSON.parse(cachedLocation);
            // If coordinates are very close (< 100m difference), use cached
            if (
              Math.abs(parsed.latitude - latitude) < 0.001 &&
              Math.abs(parsed.longitude - longitude) < 0.001 &&
              !isDataStale(parsed.timestamp)
            ) {
              console.log("📦 USING CACHED GEOCODE");
              setUserLocation(`${parsed.city}, ${parsed.province}`);
              setLoadingLocation(false);
              shouldGeocode = false;
            }
          }

          if (shouldGeocode) {
            const geo = await reverseGeocode(latitude, longitude);

            console.log("📍 GEOCODED LOCATION:", geo);

            setUserLocation(`${geo.city}, ${geo.province}`);

            const userLocationData = {
              ...geo,
              latitude,
              longitude,
              timestamp: Date.now()
            };

            localStorage.setItem("user_location", JSON.stringify(userLocationData));

            console.log("💾 SAVED USER LOCATION:", userLocationData);

            setLoadingLocation(false);
          }

          const storeRes = await getNearestStore(latitude, longitude);

          console.log("🏪 NEAREST STORE RESPONSE:", storeRes);

          if (storeRes.success && storeRes.data) {
            const store = storeRes.data.nearestStore;

            console.log("📊 STORE DETAILS:", {
              name: store.name,
              storeCoords: {
                latitude: store.latitude,
                longitude: store.longitude
              },
              calculatedDistance: store.distance,
              maxServiceRadius: store.maxServiceRadius,
              isInServiceArea: storeRes.data.isInServiceArea
            });

            console.log(
              "🔗 VERIFY ON GOOGLE MAPS:",
              `https://www.google.com/maps/dir/${latitude},${longitude}/${store.latitude},${store.longitude}`
            );

            setNearestStore(store);
            setDistance(store.distance);
            setIsInRange(storeRes.data.isInServiceArea);

            // Save to localStorage with timestamp
            localStorage.setItem(
              "nearest_store",
              JSON.stringify({
                ...store,
                timestamp: Date.now()
              })
            );
          }
        } catch (error) {
          console.error("❌ ERROR:", error);
          setUserLocation("Unknown Location");
          localStorage.removeItem("user_location");
        } finally {
          setLoadingLocation(false);
          setLoadingStore(false);
          setIsRefreshing(false);
        }
      },
      (error) => {
        console.error("❌ GEOLOCATION ERROR:", {
          code: error.code,
          message: error.message
        });

        setUserLocation("Location access denied");
        setIsInRange(false);
        localStorage.removeItem("user_location");
        setLoadingLocation(false);
        setLoadingStore(false);
        setIsRefreshing(false);
      }
    );
  };

  // Initial load
  useEffect(() => {
    fetchLocationData();
  }, []);

  // Check for stale data on mount
  useEffect(() => {
    const cachedLocation = localStorage.getItem("user_location");
    if (cachedLocation) {
      const { timestamp } = JSON.parse(cachedLocation);
      if (isDataStale(timestamp)) {
        console.log("⚠️ STALE DATA DETECTED - Refreshing...");
        localStorage.removeItem("user_location");
        localStorage.removeItem("nearest_store");
      }
    }
  }, []);

  // Permission change listener
  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((permission) => {
        permission.onchange = () => {
          if (permission.state !== "granted") {
            localStorage.removeItem("user_location");
            localStorage.removeItem("nearest_store");
            setUserLocation("Your Location");
            setNearestStore(null);
          }
        };
      });
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setLoadingLocation(true);
    setLoadingStore(true);
    localStorage.removeItem("user_location");
    localStorage.removeItem("nearest_store");
    fetchLocationData();
  };

  return (
    <div className="sticky top-20 z-40 w-full border-b bg-muted/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-2 text-sm md:flex-row md:justify-center md:items-center">
          {/* User Location with Loading Skeleton */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <LocateFixed className="h-4 w-4 text-blue-600 flex-shrink-0" />
            {loadingLocation ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">Detecting your location</span>
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            ) : (
              <span className="truncate">{userLocation}</span>
            )}
          </div>

          <div className="hidden h-5 w-px bg-border md:block md:mx-4" />

          {/* Nearest Store */}
          {loadingStore ? (
            <div className="flex flex-wrap items-center gap-2">
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" />
              <span className="text-muted-foreground text-sm">Detecting nearest store</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ) : nearestStore ? (
            <div className="flex flex-wrap items-center gap-2">
              {isInRange ? (
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
              )}
              <span className="hidden sm:inline text-muted-foreground">
                {isInRange ? "Showing products from" : "Nearest store"}
              </span>
              <div className="flex items-center gap-1 font-medium text-green-700">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{nearestStore.name}</span>
              </div>
              {distance !== null && (
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  ({distance.toFixed(1)} KM)
                </span>
              )}
              {!isInRange && nearestStore && (
                <span className="text-xs text-orange-600 flex-shrink-0">
                  (Outside {nearestStore.maxServiceRadius} KM service area)
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No store found</span>
          )}

          {/* Refresh Button */}
          {!loadingLocation && !loadingStore && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed ml-2"
              title="Refresh location"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Update</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}