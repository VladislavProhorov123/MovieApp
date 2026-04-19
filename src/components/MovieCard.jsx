import React from "react";
import { useFavorites } from "../store/useFavorites";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  } = movie;

  const {favorites, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some((m) => m.id === id)

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation()
    toggleFavorite(movie)

   
  };
  return (
    <Link to={`/movie/${id}`}>
      <div className="movie-card relative group cursor-pointer">
        <button
          className="absolute top-2 right-2 z-10 bg-black/60 p-2 rounded-full hover:scale-110 transition cursor-pointer"
          onClick={handleFavorite}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
          alt={title}
        />

        <div className="mt-4">
          <h3>{title}</h3>
          <div className="content">
            <div className="rating">
              <img src="star.svg" alt="Star Icon" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>

            <span>●</span>
            <p className="lang">{original_language}</p>
            <span>●</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
