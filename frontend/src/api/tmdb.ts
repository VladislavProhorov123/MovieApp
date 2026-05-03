export const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string

export const API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

export const endpoints = {
  trending: (): string => `${API_BASE_URL}/trending/movie/week`,
  discover: (params: string): string => `${API_BASE_URL}/discover/movie?${params}`,
  movieDetails: (id: number): string => `${API_BASE_URL}/movie/${id}`,
  genres: (): string => `${API_BASE_URL}/genre/movie/list`
}