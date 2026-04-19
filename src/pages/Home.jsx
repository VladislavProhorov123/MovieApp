import React, { useEffect, useRef, useState } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import useDebounce from "../hook/useDebounce";
import { Link } from "react-router-dom";
import { endpoints } from "../api/tmdb";

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

  const moviesRef = useRef(null)

  const fetchMovies = async (query = "", pageNumber = 1) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNumber}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNumber}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      setTotalPage(data.total_pages || 1);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if(moviesRef.current) {
      moviesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }, [page])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header className="m-0">
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
