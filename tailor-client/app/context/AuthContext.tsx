'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/lib/axios'
import axios from 'axios'

type User = {
  id: string
  name: string
  email: string
  isProfileCompleted: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)


useEffect(() => {
  const fetchUser = async () => {
    try {
    const res = await api.get("/api/user/get-user", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, []);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true })
    } catch (err) {
      console.error("Logout API failed", err)
    } finally {
      setUser(null)  
    }
  }


  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
