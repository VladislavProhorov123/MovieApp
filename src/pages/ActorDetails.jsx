import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_OPTIONS } from "../api/tmdb";

export default function ActorDetails() {
  const { id } = useParams();

  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchActor = async () => {
      const [actorRes, moviesRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${id}`, API_OPTIONS),
        fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits`,
          API_OPTIONS,
        ),
      ]);

      const actorData = await actorRes.json();
      const moviesData = await moviesRes.json();

      setActor(actorData);
      setMovies(moviesData.cast || []);
    };

    fetchActor();
  }, [id]);

  if (!actor) return null;
  return (
    <div className="min-h-screen text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0d23] to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          ← Back
        </button>

        <div className="grid md:grid-cols-[300px_1fr] gap-10 items-start">
          <div className="w-full">
            <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-full object-cover"
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
                    : "/no-avatar.png"
                }
                alt={actor.name}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold">{actor.name}</h1>

            <div className="text-sm text-gray-400 flex flex-wrap gap-4">
              {actor.birthday && <span>🎂 {actor.birthday}</span>}
              {actor.place_of_birth && <span>📍 {actor.place_of_birth}</span>}
              <span>⭐ {actor.popularity?.toFixed(1)}</span>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-2xl">
              {actor.biography || "No biography available"}
            </p>
          </div>
        </div>

        <h2 className="text-2xl mt-12 mb-6">Known For</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {movies.slice(0, 15).map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition">
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
      </div>
    </div>
  );
}
