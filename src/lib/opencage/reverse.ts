import axios from "axios";

export async function reverseGeocode(lat: number, lng: number) {
  const res = await axios.get(
    "https://api.opencagedata.com/geocode/v1/json",
    {
      params: {
        q: `${lat},${lng}`,
        key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
        language: "id",
        countrycode: "id",
        limit: 1,
      },
    }
  );

  const r = res.data.results[0];
  if (!r) throw new Error("Address not found");

  const c = r.components;

  return {
    addressLine: r.formatted,
    city: c.city || c.town || c.village || "",
    district: c.suburb || c.city_district || c.county || "",
    province: c.state || "",
    postalCode: c.postcode || "",
  };
}
