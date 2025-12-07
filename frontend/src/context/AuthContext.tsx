/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { authApi } from '../lib/api'
import type { Session } from '@supabase/supabase-js'

type AuthStatus = 'loading' | 'authenticated' | 'guest'

export interface UserProfile {
  id: string
  name: string
  email: string
  enrollment: string
  avatarUrl: string
  trustScore: number
  batch?: string
  branch?: string
  role?: string
}

interface SignupData {
  email: string
  password: string
  name: string
  enrollment?: string
  batch?: string
  branch?: string
  profilePic?: string
}

interface AuthContextValue {
  status: AuthStatus
  user: UserProfile | null
  session: Session | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Helper to transform API user to UserProfile
const transformUser = (apiUser: {
  id: string
  email: string
  name: string
  enrollment?: string
  profile_pic?: string
  trust_score?: number
  batch?: string
  branch?: string
  role?: string
}): UserProfile => ({
  id: apiUser.id,
  name: apiUser.name || '',
  email: apiUser.email,
  enrollment: apiUser.enrollment || '',
  avatarUrl: apiUser.profile_pic || '',
  trustScore: apiUser.trust_score ?? 50,
  batch: apiUser.batch,
  branch: apiUser.branch,
  role: apiUser.role,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession) {
          setSession(currentSession)
          
          // Fetch user profile from backend
          const response = await authApi.getProfile(currentSession.access_token)
          if (response.success && response.data?.user) {
            setUser(transformUser(response.data.user))
            setStatus('authenticated')
          } else {
            // Session exists but profile fetch failed - might be stale
            setStatus('guest')
          }
        } else {
          setStatus('guest')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setStatus('guest')
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event)
        
        if (event === 'SIGNED_OUT' || !newSession) {
          setSession(null)
          setUser(null)
          setStatus('guest')
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession)
          
          // Fetch updated profile
          const response = await authApi.getProfile(newSession.access_token)
          if (response.success && response.data?.user) {
            setUser(transformUser(response.data.user))
            setStatus('authenticated')
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Use Supabase client for login to handle session persistence
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.session) {
        setSession(data.session)
        
        // Fetch user profile from backend
        const profileResponse = await authApi.getProfile(data.session.access_token)
        if (profileResponse.success && profileResponse.data?.user) {
          setUser(transformUser(profileResponse.data.user))
          setStatus('authenticated')
          return { success: true }
        }
      }

      return { success: false, error: 'Failed to fetch user profile' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    try {
      // Use backend API for signup to handle profile creation
      const response = await authApi.signup(data)

      if (!response.success) {
        return { success: false, error: response.error || 'Signup failed' }
      }

      // After signup, log the user in
      return await login(data.email, data.password)
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Signup failed. Please try again.' }
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      if (session?.access_token) {
        await authApi.logout(session.access_token)
      }
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setSession(null)
      setUser(null)
      setStatus('guest')
    }
  }, [session])

  const refreshProfile = useCallback(async () => {
    if (!session?.access_token) return

    try {
      const response = await authApi.getProfile(session.access_token)
      if (response.success && response.data?.user) {
        setUser(transformUser(response.data.user))
      }
    } catch (error) {
      console.error('Profile refresh error:', error)
    }
  }, [session])

  const value = useMemo(
    () => ({
      status,
      user,
      session,
      login,
      signup,
      logout,
      refreshProfile,
    }),
    [status, user, session, login, signup, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
