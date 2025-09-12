// JWT authentication utilities
import jwt from "jsonwebtoken"
import { env } from "../env"
import type { User } from "../types/database"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export function signToken(user: Pick<User, "id" | "email" | "role">): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}
