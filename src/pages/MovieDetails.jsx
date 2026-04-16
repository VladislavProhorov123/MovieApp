import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { API_OPTIONS } from "../api/tmdb";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}`,
          API_OPTIONS
        );

        const data = await res.json();
        setMovie(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading || !movie) return <Spinner />;

  return (
    <div className="min-h-screen text-white relative">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`
            : "none",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">

          {/* POSTER */}
          <img
            className="w-full md:w-[320px] rounded-xl shadow-2xl"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "/no-movie.png"
            }
            alt={movie.title}
          />

          {/* INFO */}
          <div className="flex flex-col gap-4">

            <h1 className="text-3xl md:text-5xl font-bold">
              {movie.title}
            </h1>

            {/* META */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-300">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span>{movie.release_date}</span>
              <span>•</span>
              <span>${movie.budget?.toLocaleString()}</span>
            </div>

            {/* GENRES */}
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

            {/* OVERVIEW */}
            <p className="text-gray-300 leading-relaxed max-w-2xl">
              {movie.overview}
            </p>

            {/* COUNTRIES */}
            <div className="text-sm text-gray-400">
              Countries: {movie.production_countries?.map((c) => c.name).join(", ")}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}