// lib/opencage.ts
import axios from "axios";

interface IOpenCageResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

export async function searchAddress(query: string) {
  if (!query) return [];

  const res = await axios.get(
    "https://api.opencagedata.com/geocode/v1/json",
    {
      params: {
        q: query,
        key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
        language: "id",
        limit: 5,
        countrycode: "id",
      },
    }
  );

  return (res.data.results as IOpenCageResult[]).map((r) => ({
    label: r.formatted,
    latitude: r.geometry.lat,
    longitude: r.geometry.lng,
  }));
}
