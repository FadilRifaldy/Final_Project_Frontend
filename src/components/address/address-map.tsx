"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  latitude?: number;
  longitude?: number;
  onPick: (lat: number, lng: number) => void;
}

export default function AddressMap({ latitude, longitude, onPick }: Props) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [longitude ?? 106.8, latitude ?? -6.2],
      zoom: 13,
    });
    map.on("click", (e) => {
      onPick(e.lngLat.lat, e.lngLat.lng);
    });
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current || latitude == null || longitude == null) return;
    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([longitude, latitude]);
    }

    mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
  }, [latitude, longitude]);

  return <div ref={containerRef} style={{ height: 300 }} />;
}
