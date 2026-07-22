import React, { createContext, useContext, useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { supabase, type User, type Session } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AuthState = {
  user: User | null
  session: Session | null
  loading: boolean
}

type AuthContextType = AuthState & {
  signUp: (email: string, password: string, meta?: Record<string, unknown>) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  sendOtp: (email: string) => Promise<{ error: Error | null }>
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    // Get initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ user: session?.user ?? null, session, loading: false })
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({ user: session?.user ?? null, session, loading: false })
      }
    )

    // Capacitor Deep Link listener for OAuth callbacks
    let appListener: any;
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/app').then(({ App }) => {
        appListener = App.addListener('appUrlOpen', (event) => {
          const url = event.url;
          if (url.includes('com.resqnet.app://auth/callback')) {
            import('@capacitor/browser').then(({ Browser }) => Browser.close());
            
            const hash = url.split('#')[1];
            if (hash) {
              const params = new URLSearchParams(hash.replace(/&amp;/g, '&'));
              const access_token = params.get('access_token');
              const refresh_token = params.get('refresh_token');
              if (access_token && refresh_token) {
                supabase.auth.setSession({ access_token, refresh_token });
              }
            }
          }
        });
      });
    }

    return () => {
      subscription.unsubscribe()
      if (appListener) appListener.remove()
    }
  }, [])

  // ---- Auth actions -------------------------------------------------------

  const signUp = async (
    email: string,
    password: string,
    meta?: Record<string, unknown>
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: meta },
    })
    return { error: error as Error | null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signInWithGoogle = async () => {
    // Determine redirect URL based on platform
    let redirectUrl = `${window.location.origin}/home`
    const isCapacitor = Capacitor.isNativePlatform();

    if (isCapacitor) {
      redirectUrl = 'com.resqnet.app://auth/callback'
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: redirectUrl,
        skipBrowserRedirect: isCapacitor,
        queryParams: {
          prompt: 'select_account'
        }
      },
    })
    
    if (isCapacitor && data?.url) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url: data.url });
    }
    
    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Send a 6-digit OTP to the user's email (magic link / OTP flow)
  const sendOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    return { error: error as Error | null }
  }

  // Verify the 6-digit OTP entered by the user
  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    return { error: error as Error | null }
  }

  // Update password for a logged-in user
  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error as Error | null }
  }

  return (
    <AuthContext.Provider
      value={{ ...state, signUp, signIn, signInWithGoogle, signOut, sendOtp, verifyOtp, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
