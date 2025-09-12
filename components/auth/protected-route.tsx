// Protected route wrapper component
"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
  allowedRoles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  const roles = allowedRoles || requiredRole

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (roles && user) {
        // Special case: if user is trying to access instructor routes but isn't approved yet
        if (roles.includes("instructor") && user.role === "student") {
          // Check if they have a pending application
          checkInstructorApplicationStatus(user.id)
          return
        }

        if (!roles.includes(user.role)) {
          router.push("/unauthorized")
          return
        }
      }
    }
  }, [user, loading, isAuthenticated, roles, router, redirectTo])

  const checkInstructorApplicationStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/instructor/application-status?userId=${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "pending") {
          router.push("/instructor/application-pending")
        } else if (data.status === "rejected") {
          router.push("/instructor/application-rejected")
        } else {
          router.push("/instructor/apply")
        }
      } else {
        router.push("/instructor/apply")
      }
    } catch (error) {
      router.push("/instructor/apply")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (roles && user && !roles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
