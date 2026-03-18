import { createContext, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("questify-session")
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  })

  const signIn = (payload) => {
    setSession(payload)
    localStorage.setItem("questify-session", JSON.stringify(payload))
  }

  const signOut = () => {
    setSession(null)
    localStorage.removeItem("questify-session")
  }

  const value = useMemo(
    () => ({
      session,
      signIn,
      signOut,
      isLoggedIn: Boolean(session?.userId),
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
