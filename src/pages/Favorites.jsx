import React from "react";
import { useFavorites } from "../store/useFavorites";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0d23] to-black" />
      <div className="absolute inset-0 bg-[url('/hero-bg.png')] opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition cursor-pointer"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-8">
            Favorites ({favorites.length})
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-400 mt-32">
            No favorite movies yet
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
