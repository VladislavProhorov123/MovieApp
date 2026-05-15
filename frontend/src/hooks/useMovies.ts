import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api/movies";

type Filters = {
  sort: string;
  genre: string;
  year: string;
}

export const useMovies = (
  search: string, page: number, filters: Filters
) => {
  return useQuery({
    queryKey: ["movies", search, page, filters],

    queryFn: () => getMovies(search, page, filters)
  })
}