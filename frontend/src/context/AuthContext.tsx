/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type AuthStatus = 'authenticated' | 'guest'

interface UserProfile {
  id: string
  name: string
  email: string
  enrollment: string
  avatarUrl: string
  trustScore: number
}

interface AuthContextValue {
  status: AuthStatus
  user: UserProfile | null
  login: (user: UserProfile) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('authenticated')
  const [user, setUser] = useState<UserProfile | null>({
    id: 'u-001',
    name: 'Riya Sharma',
    email: 'riya.sharma@college.edu',
    enrollment: 'ENG21CS045',
    avatarUrl: 'https://profiles.cascadeaistatic.com/riya.png',
    trustScore: 86,
  })

  const login = (nextUser: UserProfile) => {
    setUser(nextUser)
    setStatus('authenticated')
  }

  const logout = () => {
    setUser(null)
    setStatus('guest')
  }

  const value = useMemo(
    () => ({
      status,
      user,
      login,
      logout,
    }),
    [status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
