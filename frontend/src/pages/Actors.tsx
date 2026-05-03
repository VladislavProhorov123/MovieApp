import { useEffect, useState } from "react";
import { API_BASE_URL, API_OPTIONS } from "../api/tmdb";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../hook/useDebounce";

type Actor = {
  id: number
  name: string
  profile_path?: string | null
}

type ApiResponse = {
  results: Actor[]
  total_pages: number
}


export default function Actors() {
  const [actors, setActors] = useState<Actor[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [search, setSearch] = useState<string>("")
  const debouncedSearch = useDebounce<string>(search, 400);

  const navigate = useNavigate();

  const fetchActors = async () => {
    setLoading(true);

    try {
      const endpoint = debouncedSearch
        ? `${API_BASE_URL}/search/person?query=${encodeURIComponent(
            debouncedSearch,
          )}&page=${page}`
        : `${API_BASE_URL}/person/popular?page=${page}`;

      const res = await fetch(endpoint, API_OPTIONS);
      const data: ApiResponse = await res.json();

      setActors(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0d23] to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">
        <div className="flex flex-row-reverse items-center">
          {" "}
          <h1 className="text-4xl font-bold mb-6">Actors</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search actors..."
          className="w-full max-w-md px-4 py-3 mb-8 rounded-lg bg-white/10 text-white outline-none"
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {actors.map((actor) => (
              <Link key={actor.id} to={`/actor/${actor.id}`}>
                <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition">
                  <img
                    className="w-full h-[260px] object-cover"
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300/${actor.profile_path}`
                        : "/no-avatar.png"
                    }
                    alt={actor.name}
                  />

                  <div className="p-2">
                    <p className="text-sm text-center">{actor.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-white/10 rounded disabled:opacity-30"
          >
            Prev
          </button>

          <span className="text-sm text-gray-300">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-white/10 rounded disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
