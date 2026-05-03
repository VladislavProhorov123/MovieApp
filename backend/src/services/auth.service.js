import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = "7d"

export async function registerUser(email, password) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if(existingUser) {
    throw new Error('Пользователь с таким email уже существует')
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hash
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email},
    JWT_SECRET,
    {expiresIn: JWT_EXPIRES_IN}
  )

  return {
    user: {
      id: user.id, 
      email: user.email,
      createdAt: user.createdAt
    },
    token
  }
}

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if(!user) {
    throw new Error("Неверный email или пароль")
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if(!isValidPassword) {
    throw new Error("Неверный email или пароль")
  }

  const token = jwt.sign(
    {userId: user.id, email: user.email},
    JWT_SECRET,
    {expiresIn: JWT_EXPIRES_IN}
  )

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  }
}