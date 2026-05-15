import { useQuery } from "@tanstack/react-query";
import { API_OPTIONS, endpoints } from "../api/tmdb";

async function fetchTrending() {
  const res = await fetch(endpoints.trending(), API_OPTIONS)
  if(!res.ok) throw new Error("Failed to fetch trending")
  return res.json()
}

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["trending-movies"],
    queryFn: fetchTrending,
    staleTime: 1000 * 60 * 5
  })
}