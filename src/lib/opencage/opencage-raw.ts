import axios from "axios";
import { IOpenCageSuggestion } from "@/types/opencage";

export async function searchAddressRaw(
  query: string
): Promise<IOpenCageSuggestion[]> {
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

  return res.data.results as IOpenCageSuggestion[];
}
