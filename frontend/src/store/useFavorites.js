import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavorites = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (movie) =>
        set((state) => {
          const exists = state.favorites.some((m) => m.id === movie.id);

          if (exists) {
            return {
              favorites: state.favorites.filter((m) => m.id !== movie.id),
            };
          }

          return {
            favorites: [...state.favorites, movie],
          };
        }),

      isFavorite: (id) => get().favorites.some((m) => m.id === id),
    }),

    {
      name: "favorites-storage",
    },
  ),
);
