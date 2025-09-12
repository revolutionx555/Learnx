// Authentication middleware for API routes
import type { NextRequest } from "next/server"
import { verifyToken, type JWTPayload } from "./jwt"
import { userOperations } from "../database/mongodb"

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload & {
    id: string
  }
}

export async function authenticateRequest(request: NextRequest): Promise<JWTPayload | null> {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload) {
    return null
  }

  // Verify user still exists and is active
  const user = await userOperations.findById(payload.userId)
  if (!user || !user.is_active) {
    return null
  }

  return payload
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const user = await authenticateRequest(request)

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = { ...user, id: user.userId }

    return handler(authenticatedRequest)
  }
}

export function requireRole(roles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<Response>) =>
    async (request: NextRequest): Promise<Response> => {
      const user = await authenticateRequest(request)

      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      }

      if (!roles.includes(user.role)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        })
      }

      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = { ...user, id: user.userId }

      return handler(authenticatedRequest)
    }
}

export async function verifyAuthToken(
  request: NextRequest,
): Promise<{ success: boolean; user?: JWTPayload & { id: string } }> {
  const user = await authenticateRequest(request)

  if (!user) {
    return { success: false }
  }

  return {
    success: true,
    user: { ...user, id: user.userId },
  }
}
