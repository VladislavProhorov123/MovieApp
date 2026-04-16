const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

export const endpoints = {
  trending: () => `${API_BASE_URL}/trending/movie/week`,
  discover: (params) => `${API_BASE_URL}/discover/movie?${params}`,
  movieDetails: (id) => `${API_BASE_URL}/movie/${id}`,
  genres: () => `${API_BASE_URL}/genre/movie/list`
}