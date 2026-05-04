import { useEffect, useRef, useState } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import useDebounce from "../hook/useDebounce";
import { Link } from "react-router-dom";
import { endpoints } from "../api/tmdb";
import Select from "../components/Select";
import { useSearchHistory } from "../store/useSearchHistory";
import { useAuth } from "../store/useAuth";
import AuthModal from "../components/AuthModal";

type Movie = {
  id: number;
  title: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
};

type Genre = {
  id: number;
  name: string;
};

type ApiResponse = {
  results: Movie[];
  total_pages: number;
};

type Filters = {
  sort: string;
  genre: string;
  year: string;
};

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isTrendingLoading, setIsTrendingLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  const [filters, setFilters] = useState<Filters>({
    sort: "popularity.desc",
    genre: "",
    year: "",
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const { history, addSearch, clearHistory } = useSearchHistory();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isFirstRender = useRef<boolean>(true);
  const moviesRef = useRef<HTMLDivElement | null>(null);

  const user = useAuth((s) => s.user);
  const [showAuth, setShowAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false)

  const fetchGenres = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/genre/movie/list`, API_OPTIONS);
      const data: { genres: Genre[] } = await res.json();
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

  const buildEndpoint = (query: string, pageNumber: number) => {
    if (query) {
      return `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNumber}`;
    }

    const params = new URLSearchParams({
      page: String(pageNumber),
      sort_by: filters.sort,
    });

    if (filters.genre) {
      params.append("with_genres", filters.genre);
    }

    if (filters.year) {
      params.append("primary_release_year", filters.year);
    }

    return `${API_BASE_URL}/discover/movie?${params.toString()}`;
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (moviesRef.current) {
      moviesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    moviesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      addSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header className="m-0">
            <div className="flex items-center gap-x-2">
              <Link
                to="/favorites"
                className="text-white bg-white/10 px-4 py-2 rounded"
              >
                Favorites
              </Link>
              <Link
                className="text-white bg-white/10 px-4 py-2 rounded"
                to="/actors"
              >
                Actors
              </Link>
              <div className="flex items-center gap-3 relative">
                {user ? (
                  <div className="relative" >
                    <button className="flex items-center gap-2 text-white text-sm bg-white/10 px-3 py-2 rounded-lg cursor-pointer" onClick={() => setOpenMenu((p) => !p)}>
                      {user.email}
                    <span className="text-sm">▼</span>
                    </button>
                    
                    {openMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#0f0f1a] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                        <button onClick={() => {
                          useAuth.getState().logout()
                          setOpenMenu(false)
                        }} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="text-white bg-white/10 px-4 py-2 rounded cursor-pointer"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>

            <img
              src="./hero.png"
              alt="Hero Banner"
              className="max-w-[460px] h-auto "
            />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>

            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            />

            {isFocused && history.length > 0 && (
              <div
                className="max-w-3xl mx-auto mt-4 p-4 rounded-2xl 
                  bg-white/5 backdrop-blur-xl border border-white/10
                  shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Recent searches
                  </p>

                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      clearHistory();
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {history.map((item, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchTerm(item);
                        setIsFocused(false);
                      }}
                      className="px-4 py-1.5 text-sm rounded-full 
                     bg-gradient-to-r from-[#1e1b4b] to-[#312e81]
                     text-white/90
                     hover:scale-105 hover:from-[#312e81] hover:to-[#4c1d95]
                     transition-all duration-200 shadow-md cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              <ul className="flex gap-4 overflow-x-auto hide-scrollbar">
                {trendingMovies.slice(0, 5).map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="min-w-[160px] sm:min-w-[180px]"
                  >
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
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </main>
  );
}
