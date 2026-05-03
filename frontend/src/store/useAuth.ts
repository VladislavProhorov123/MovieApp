import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string
  email: string
}

type AuthState = {
  user: User | null
  token: string | null

  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null})
    }),
    {
      name: "auth-storage",
    }
  )
)