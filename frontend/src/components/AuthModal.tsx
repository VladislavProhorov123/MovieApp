import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { login, register } from "../api/auth";

export default function AuthModal({ onClose }: {onClose: () => void}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuth((s) => s.setAuth);

  const handleRegister = async () => {
    const data = await register(email, password);

    if (data.token) {
      setAuth(data.user, data.token);
      onClose();
    }
  };

  const handleLogin = async () => {
    const data = await login(email, password);

    if (data.token) {
      setAuth(data.user, data.token);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-black p-6 rounded-xl w-[320px]">
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2"
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <div className="flex gap-2">
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>

        <button onClick={onClose} className="mt-4 text-sm">
          Close
        </button>

      </div>

    </div>
  );
}
