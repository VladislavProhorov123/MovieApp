import { API_OPTIONS, endpoints } from "./tmdb";

type Filters = {
  sort: string
  genre: string
  year: string
}

export const getMovies = async (search: string, page: number, filters: Filters) => {
  let endpoint = ""

  if(search) {
    endpoint = `https://api.themoviedb.org/3/search/movie` + `?query=${encodeURIComponent(search)}` + `&page=${page}`
  } else {
    const params = new URLSearchParams({
      page: String(page),
      sort_by: filters.sort
    })

    if(filters.genre) {
      params.append("with_genres", filters.genre)
    }

    if(filters.year) {
      params.append("primary_release_year", filters.year)
    }

    endpoint = endpoints.discover(params.toString())
  }

  const response = await fetch(endpoint, API_OPTIONS)

  if(!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json()
}