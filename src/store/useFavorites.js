import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavorites = create(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorive: (movie) => set((state) => {
        if(state.favorites.some((m) => m.id === movie.id)) {
          return state
        }

        return {
          favorites: [...state.favorites, movie]
        }
      }),

      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter((m) => m.id !== id)
      })),

      isFavorite: (id) => {
        return get().favorites.some((m) => m.id === id)
      }
    }),
    {
      name: "favorites-storage"
    }
  )
)