import React, { useEffect, useRef, useState } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import useDebounce from "../hook/useDebounce";
import { Link } from "react-router-dom";
import { endpoints } from "../api/tmdb";
import Select from "../components/Select";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filters, setFilters] = useState({
    sort: "popularity.desc",
    genre: "",
    year: "",
  });
  const [genres, setGenres] = useState([]);

  const moviesRef = useRef(null);

  const fetchGenres = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/genre/movie/list`, API_OPTIONS);
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMovies = async (query = "", pageNumber = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = buildEndpoint(query, pageNumber);

      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();

      setMovieList(data.results || []);
      setTotalPage(data.total_pages || 1);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  const buildEndpoint = (query, pageNumber) => {
    let url = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie`;

    const params = new URLSearchParams({
      page: pageNumber,
      sort_by: filters.sort,
    });

    if (filters.genre) {
      params.append("with_genres", filters.genre);
    }

    if (filters.year) {
      params.append("primary_release_year", filters.year);
    }

    return `${url}?${params.toString()}`;
  };

  const fetchTrendingMovies = async () => {
    setIsTrendingLoading(true);

    try {
      const res = await fetch(endpoints.trending(), API_OPTIONS);

      const data = await res.json();

      setTrendingMovies(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTrendingLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page, filters]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (moviesRef.current) {
      moviesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header className="m-0">
            <Link
              to="/favorites"
              className="text-white bg-white/10 px-4 py-2 rounded"
            >
              Favorites
            </Link>
            <img
              src="./hero.png"
              alt="Hero Banner"
              className="max-w-[460px] h-auto "
            />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="w-full flex justify-center mt-6 mb-8">
              <div className="flex flex-row flex-wrap justify-center items-end gap-6 max-w-5xl mx-auto">
                <Select
                  label="Sort"
                  value={filters.sort}
                  onChange={(v) => setFilters({ ...filters, sort: v })}
                  options={[
                    { value: "popularity.desc", label: "Popular" },
                    { value: "vote_average.desc", label: "Top Rated" },
                    { value: "release_date.desc", label: "Newest" },
                  ]}
                />

                <Select
                  label="Genre"
                  value={filters.genre}
                  onChange={(v) => setFilters({ ...filters, genre: v })}
                  options={[
                    { value: "", label: "All" },
                    ...genres.map((g) => ({
                      value: g.id,
                      label: g.name,
                    })),
                  ]}
                />

                <Select
                  label="Year"
                  value={filters.year}
                  onChange={(v) => setFilters({ ...filters, year: v })}
                  options={[
                    { value: "", label: "All" },
                    ...Array.from({ length: 20 }, (_, i) => {
                      const y = new Date().getFullYear() - i;
                      return { value: y, label: y };
                    }),
                  ]}
                />
              </div>
            </div>
          </header>

          <section className="trending">
            <h2 className="mb-[20px]">Trending</h2>

            {isTrendingLoading ? (
              <Spinner />
            ) : (
              <ul>
                {trendingMovies.slice(0, 5).map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`}>
                    <MovieCard movie={movie} />
                  </Link>
                ))}
              </ul>
            )}
          </section>

          <section ref={moviesRef} className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-rose-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`}>
                    <MovieCard movie={movie} />
                  </Link>
                ))}
              </ul>
            )}

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </section>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10 text-white pb-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 cursor-pointer"
          >
            Prev
          </button>

          <span className="text-sm text-gray-300">
            Page {page} / {totalPage}
          </span>

          <button
            disabled={page === totalPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
