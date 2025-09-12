// Authentication hook for client-side auth management
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@/lib/types/database"

interface AuthContextType {
  user: Omit<User, "password_hash"> | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  role?: "student" | "instructor"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password_hash"> | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  // Verify token and get user profile
  useEffect(() => {
    if (token && !user) {
      fetchUserProfile()
    }
  }, [token, user])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
        localStorage.setItem("auth_user", JSON.stringify(data.data))
      } else {
        // Token is invalid, clear auth state
        logout()
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      logout()
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Login failed")
    }

    const { user: userData, token: authToken, refresh_token } = data.data

    const normalizedUser = {
      ...userData,
      id: userData.id || userData._id,
    }

    setUser(normalizedUser)
    setToken(authToken)

    // Store in localStorage
    localStorage.setItem("auth_token", authToken)
    localStorage.setItem("auth_refresh_token", refresh_token)
    localStorage.setItem("auth_user", JSON.stringify(normalizedUser))
  }

  const register = async (registerData: RegisterData) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Registration failed")
    }

    const { user: userData, token: authToken, refresh_token } = data.data

    const normalizedUser = {
      ...userData,
      id: userData.id || userData._id,
    }

    setUser(normalizedUser)
    setToken(authToken)

    // Store in localStorage
    localStorage.setItem("auth_token", authToken)
    localStorage.setItem("auth_refresh_token", refresh_token)
    localStorage.setItem("auth_user", JSON.stringify(normalizedUser))
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    // Clear localStorage
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_refresh_token")
    localStorage.removeItem("auth_user")
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
