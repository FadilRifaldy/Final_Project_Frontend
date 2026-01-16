// lib/helpers/search.backend.ts
import api from "../api/axios";

// Types
export interface SearchSuggestion {
  id: string;
  name: string;
  type: "product" | "store";
  category?: string;
  city?: string;
  image?: string | null;
}

interface SuggestionsResponse {
  success: boolean;
  suggestions: SearchSuggestion[];
}

interface CitiesResponse {
  success: boolean;
  cities: string[];
}

// API Functions
export async function getSearchSuggestions(
  query: string
): Promise<SearchSuggestion[]> {
  try {
    const response = await api.get<SuggestionsResponse>("/search/suggestions", {
      params: { q: query },
    });
    return response.data.suggestions || [];
  } catch (error) {
    console.error("Failed to get search suggestions:", error);
    return [];
  }
}

export async function getAvailableCities(): Promise<string[]> {
  try {
    const response = await api.get<CitiesResponse>("/search/cities");
    return response.data.cities || [];
  } catch (error) {
    console.error("Failed to get available cities:", error);
    return [];
  }
}