// hooks/useProductSearch.js
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/client";

const RECENT_SEARCHES_KEY = "akata_recent_searches";
const MAX_RECENT_SEARCHES = 3;

// Save search to localStorage
export const saveRecentSearch = (query) => {
  if (!query?.trim()) return;

  const searches = getRecentSearches();
  const newSearches = [
    query.trim(),
    ...searches.filter((s) => s !== query.trim()),
  ].slice(0, MAX_RECENT_SEARCHES);

  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
};

// Get recent searches from localStorage
export const getRecentSearches = () => {
  if (typeof window === "undefined") return [];
  try {
    const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch {
    return [];
  }
};

// Clear recent searches
export const clearRecentSearches = () => {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
};

// Search products with autocomplete
export const searchProducts = async (query) => {
  if (!query?.trim()) return [];

  const supabase = createClient();
  const searchTerm = query.trim().toLowerCase();

  // Use full-text search with ranking
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, currency, image, category, subcategory")
    .is("deleted_at", null)
    .eq("in_stock", true)
    .or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`,
    )
    .order("featured", { ascending: false })
    .order("views_count", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data || [];
};

// Hook for search suggestions
export const useProductSearch = (query, enabled = true) => {
  return useQuery({
    queryKey: ["product-search", query],
    queryFn: () => searchProducts(query),
    enabled: enabled && query?.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
