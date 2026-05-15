import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_OPTIONS } from "../api/tmdb";

async function fetchGenres() {
  const res = await fetch(`${API_BASE_URL}/genre/movie/list`, API_OPTIONS)
  if(!res.ok) throw new Error("Failed to fetch genres")
  return res.json()
}

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: Infinity,
  })
}