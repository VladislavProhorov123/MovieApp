import { registerUser, loginUser } from "../services/auth.service.js"

export async function register(req, res) {
  try {
    const { email, password } = req.body

    if(!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны"
      })
    }

    const data = await registerUser(email, password)

    return res.status(201).json(data)
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if(!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны" 
      })
    }

    const data = await loginUser(email, password)

    return res.status(200).json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}