import { useEffect, useRef, useState } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import useDebounce from "../hooks/useDebounce";
import { Link } from "react-router-dom";
import { endpoints } from "../api/tmdb";
import Select from "../components/Select";
import { useSearchHistory } from "../store/useSearchHistory";
import { useAuth } from "../store/useAuth";
import AuthModal from "../components/AuthModal";
import { Heart, User, LogOut, UserPlus, Clapperboard } from "lucide-react";
import { useMovies } from "../hooks/useMovies";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import { useGenres } from "../hooks/useGenres";

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

type Filters = {
  sort: string;
  genre: string;
  year: string;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);
  const [filters, setFilters] = useState<Filters>({
    sort: "popularity.desc",
    genre: "",
    year: "",
  });
  const { history, addSearch, clearHistory } = useSearchHistory();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isFirstRender = useRef<boolean>(true);
  const moviesRef = useRef<HTMLDivElement | null>(null);

  const user = useAuth((s) => s.user);
  const [showAuth, setShowAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const { data, isLoading, error } = useMovies(
    debouncedSearchTerm,
    page,
    filters,
  );

  const { data: trendingData, isLoading: isTrendingLoading } =
    useTrendingMovies();

  const { data: genresData } = useGenres();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (!data?.results?.length) return;

    moviesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [data]);

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
            <div className="flex items-center gap-2 flex-wrap sm:gap-x-2">
              <Link
                to="/favorites"
                className="text-white bg-white/10 px-4 py-2 rounded flex items-center justify-center gap-1"
              >
                <Heart size={20} />
                Favorites
              </Link>
              <Link
                className="text-white bg-white/10 px-4 py-2 rounded flex items-center justify-center gap-1"
                to="/actors"
              >
                <Clapperboard size={20} />
                Actors
              </Link>
              <div className="flex items-center gap-3 relative">
                {user ? (
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 text-white text-sm bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
                      onClick={() => setOpenMenu((p) => !p)}
                    >
                      <User />
                      {user.email}
                      <span className="text-sm">▼</span>
                    </button>

                    {openMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#0f0f1a] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={() => {
                            useAuth.getState().logout();
                            setOpenMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <LogOut />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="text-white bg-white/10 px-4 py-2 rounded cursor-pointer flex justify-center items-center gap-1"
                  >
                    <UserPlus />
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
                    ...(genresData?.genres?.map((g: Genre) => ({
                      value: String(g.id),
                      label: g.name,
                    })) ?? []),
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
                {trendingData?.results?.slice(0, 5).map((movie) => (
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
            ) : error ? (
              <p className="text-rose-500">{(error as Error).message}</p>
            ) : (
              <ul>
                {data?.results?.map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`}>
                    <MovieCard movie={movie} />
                  </Link>
                ))}
              </ul>
            )}
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
            Page {page} / {data?.totalPage}
          </span>

          <button
            disabled={page === data?.totalPage}
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
