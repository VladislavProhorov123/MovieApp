import { registerUser, loginUser } from "../services/auth.service"
import { Request, Response } from 'express'
import { verifyCaptcha } from "../services/captcha.service"

export async function register(req: Request, res: Response) {
  try {
    const { email, password, captcha } = req.body

    if(!email || !password || !captcha) {
      return res.status(400).json({
        message: "Email, пароль и капча обязательны"
      })
    }

    const captchaRes = await verifyCaptcha(captcha)

    if(!captchaRes.success) {
      return res.status(400).json({
        message: "Капча не пройдена",
        errors: captchaRes['error-codes']
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
    const { email, password, captcha } = req.body

    if(!email || !password || !captcha) {
      return res.status(400).json({
        message: "Email, пароль и капча обязательны"
      })
    }

    const captchaRes = await verifyCaptcha(captcha)

    if(!captchaRes.success) {
      return res.status(400).json({
        message: "Капча не пройдена",
        errors: captchaRes['error-codes']
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