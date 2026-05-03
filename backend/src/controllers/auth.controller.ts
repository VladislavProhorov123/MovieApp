import { registerUser, loginUser } from "../services/auth.service"
import { Request, Response } from 'express'

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if(!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны"
      })
    }

    const data = await registerUser(email, password)

    return res.status(201).json(data)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if(!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны" 
      })
    }

    const data = await loginUser(email, password)

    return res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
}