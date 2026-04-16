import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_OPTIONS } from "../api/tmdb";
import Spinner from "../components/Spinner";
import CastSkeleton from "../components/CastSkeleton";
import SimilarSkeleton from "../components/SimilarSkeleton";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      try {
        const [movieRes, creditsRes, similarRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits`,
            API_OPTIONS,
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/similar`,
            API_OPTIONS,
          ),
        ]);

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const similarData = await similarRes.json();

        setMovie(movieData);
        setCredits(creditsData);
        setSimilar(similarData.results || []);
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
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
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

            <div className="text-sm text-gray-300 flex flex-wrap gap-3">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span>{movie.release_date}</span>
              <span>•</span>
              <span>${movie.budget?.toLocaleString()}</span>
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
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl mb-4">Cast</h2>

          {!credits ? (
            <CastSkeleton />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
              {credits.cast?.slice(0, 16).map((actor) => (
                <div key={actor.id} className="text-center space-y-2">
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
    </div>
  );
}
