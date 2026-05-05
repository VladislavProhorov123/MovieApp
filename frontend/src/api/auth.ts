const API = "https://movieapp-6-8c4k.onrender.com/api/auth"

export async function register(email: string, password: string, captcha: string) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, captcha })
  })

  return res.json()
}

export async function login(email: string, password: string, captcha: string) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, captcha })
  })

  return res.json()
}