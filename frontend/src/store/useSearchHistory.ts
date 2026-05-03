import { create } from "zustand";
import { persist } from "zustand/middleware";

type SearchHistoryState = {
  history: string[]
  addSearch: (query: string) => void
  clearHistory: () => void
}

export const useSearchHistory = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],

      addSearch: (query) => set((state) => {
        const trimmed = query.trim()
        if(!trimmed) return state

        const filtered = state.history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())

        return {
          history: [trimmed, ...filtered].slice(0, 8)
        }
      }),

      clearHistory: () => set({ history: []})
    }),
    {
      name: "search-history"
    }
  )
)