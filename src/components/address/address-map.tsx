"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  latitude?: number;
  longitude?: number;
  onPick: (lat: number, lng: number) => void;
  height?: number;
  markerColor?: string;
}

export default function MapPicker({
  latitude,
  longitude,
  onPick,
  height = 350,
  markerColor = "#ef4444"
}: Props) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [containerId] = useState(() => {
    return `map-${Math.random().toString(36).substr(2, 9)}`;
  });

  const DEFAULT_LAT = -6.9175;  
  const DEFAULT_LNG = 107.6191;

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if (!containerRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    console.log("🗺️ MapTiler API Key:", apiKey ? "✅ Found" : "❌ Missing");

    if (!apiKey) {
      console.error("❌ NEXT_PUBLIC_MAPTILER_KEY is not set!");
      return;
    }

    // ✅ FIX: Use valid coordinates or default
    const initLat = latitude && latitude !== 0 ? latitude : DEFAULT_LAT;
    const initLng = longitude && longitude !== 0 ? longitude : DEFAULT_LNG;

    console.log("🗺️ Map Init:", { initLat, initLng });

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
        center: [initLng, initLat], // ✅ Use valid coordinates
        zoom: 13,
      });

      map.on("load", () => {
        console.log("✅ Map loaded successfully");
      });

      map.on("error", (e) => {
        console.error("❌ Map error:", e);
      });

      map.on("click", (e) => {
        console.log("📍 Map clicked:", e.lngLat);
        onPick(e.lngLat.lat, e.lngLat.lng);
      });

      mapRef.current = map;
    } catch (error) {
      console.error("❌ Error initializing map:", error);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    
    // ✅ FIX: Use valid coordinates or default
    const lat = latitude && latitude !== 0 ? latitude : DEFAULT_LAT;
    const lng = longitude && longitude !== 0 ? longitude : DEFAULT_LNG;
    
    console.log("🎯 Setting marker:", { lat, lng });
    
    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new maplibregl.Marker({ 
      color: markerColor,
      draggable: false 
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    mapRef.current.flyTo({ 
      center: [lng, lat], 
      zoom: 15,
      essential: true 
    });
  }, [latitude, longitude, markerColor]);

  return (
    <div 
      ref={containerRef}
      id={containerId}
      className="w-full rounded-lg"
      style={{ 
        height, 
        minHeight: height,
        backgroundColor: "#e5e7eb"
      }} 
    />
  );
}