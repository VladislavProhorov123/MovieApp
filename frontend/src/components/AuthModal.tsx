import { useState } from "react"
import { login, register } from "../api/auth"
import { useAuth } from "../store/useAuth"

type Props = {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "register">("login")

  const setAuth = useAuth((s) => s.setAuth)

  const handleSubmit = async () => {
    const data =
      mode === "login"
        ? await login(email, password)
        : await register(email, password)

    if (data.token) {
      setAuth(data.user, data.token)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-[360px] bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-[fadeIn_0.2s_ease-out] flex flex-col items">
        <h2 className="text-xl font-semibold text-white mb-4">
          {mode === "login" ? "Login" : "Create account"}
        </h2>

        <div className="flex gap-2 text-sm text-gray-400 mb-4">
          <button
            onClick={() => setMode("login")}
            className={mode === "login" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg cursor-pointer" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg cursor-pointer"}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={mode === "register" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg cursor-pointer" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg cursor-pointer"}
          >
            Register
          </button>
        </div>

        <input
          className="w-full p-3 mb-3 rounded-lg bg-white/5 text-white outline-none border border-white/10"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded-lg bg-white/5 text-white outline-none border border-white/10"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition cursor-pointer text-white"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        

        <button
          onClick={onClose}
          className="mt-5 text-xs text-gray-500 hover:text-white w-full cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  )
}