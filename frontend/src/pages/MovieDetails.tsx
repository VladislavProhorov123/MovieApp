import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_OPTIONS } from "../api/tmdb";
import Spinner from "../components/Spinner";
import CastSkeleton from "../components/CastSkeleton";
import SimilarSkeleton from "../components/SimilarSkeleton";
import { useFavorites } from "../store/useFavorites";
import { useAuth } from "../store/useAuth";
import AuthModal from "../components/AuthModal";

type Genre = {
  id: number;
  name: string;
};

type Cast = {
  id: number;
  name: string;
  profile_path?: string | null;
};

type Movie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  runtime?: number;
  release_date?: string;
  budget?: number;
  genres?: Genre[];
};

type Credits = {
  cast: Cast[];
};

type Video = {
  key: string;
  type: string;
  site: string;
};

type ApiResponse<T> = {
  results: T[];
};

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);

  const { toggleFavorite, favorites } = useFavorites();

  const favorite = movie ? favorites.some((m) => m.id === movie.id) : false;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      try {
        const [movieRes, creditsRes, similarRes, recRes, videoRes] =
          await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS),
            fetch(
              `https://api.themoviedb.org/3/movie/${id}/credits`,
              API_OPTIONS,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/${id}/similar`,
              API_OPTIONS,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/${id}/recommendations`,
              API_OPTIONS,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/${id}/videos`,
              API_OPTIONS,
            ),
          ]);

        const movieData: Movie = await movieRes.json();
        const creditsData: Credits = await creditsRes.json();
        const similarData: ApiResponse<Movie> = await similarRes.json();
        const recData: ApiResponse<Movie> = await recRes.json();
        const videoData: { results: Video[] } = await videoRes.json();

        const youtubeTrailer = videoData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        );

        setMovie(movieData);
        setCredits(creditsData);
        setSimilar(similarData.results || []);
        setRecommendations(recData.results || []);
        setTrailer(youtubeTrailer || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner />
      </div>
    );
  }

  const handleFavorite = () => {
    if(!user) {
      setShowAuth(true)
      return
    }

    if(movie) {
      toggleFavorite(movie)
    }
  }
  return (
    <div className="min-h-screen text-white relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`
            : "none",
        }}
      />

      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <button
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition cursor-pointer"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <img
            className="w-full md:w-[320px] rounded-xl shadow-2xl"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "/no-movie.png"
            }
            alt={movie.title}
          />

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>

            <div className="text-sm text-gray-300 flex flex-wrap gap-3 items-center">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span>{movie.release_date}</span>
              <span>•</span>
              <span>${movie.budget?.toLocaleString()}</span>

              {movie && (
                <button
                  onClick={handleFavorite}
                  className="cursor-pointer p-2 bg-white/10 rounded-full hover:scale-110 transition"
                >
                  {favorite ? "❤️" : "🤍"}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-white/10 rounded-full text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p className="text-gray-300 max-w-2xl">{movie.overview}</p>

            {trailer && (
              <button
                onClick={() => setShowTrailer(true)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 rounded transition cursor-pointer"
              >
                ▶ Watch Trailer
              </button>
            )}
          </div>
        </div>

        {showTrailer && trailer && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowTrailer(false)}
          >
            <div className="w-[90%] max-w-4xl aspect-video">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <section className="mt-12">
          <h2 className="text-xl mb-4">Cast</h2>

          {!credits ? (
            <CastSkeleton />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
              {credits.cast?.slice(0, 16).map((actor) => (
                <Link key={actor.id} to={`/actor/${actor.id}`}>
                  <div className="text-center space-y-2">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
                      <img
                        className="w-full h-full object-cover"
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}`
                            : "/no-avatar.png"
                        }
                        alt={actor.name}
                      />
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-1">
                      {actor.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-xl mb-4">Recommended For You</h2>
          {loading ? (
            <SimilarSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendations.slice(0, 10).map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <div className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition">
                    <img
                      className="w-full h-[220px] object-cover"
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                          : "/no-movie.png"
                      }
                      alt={movie.title}
                    />

                    <div className="p-2">
                      <p className="text-xs text-gray-300 line-clamp-1">
                        {movie.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-xl mb-4">Similar Movies</h2>

          {loading ? (
            <SimilarSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {similar.slice(0, 10).map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <div className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition">
                    <img
                      className="w-full h-[220px] object-cover"
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                          : "/no-movie.png"
                      }
                      alt={movie.title}
                    />

                    <div className="p-2">
                      <p className="text-xs text-gray-300 line-clamp-1">
                        {movie.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
