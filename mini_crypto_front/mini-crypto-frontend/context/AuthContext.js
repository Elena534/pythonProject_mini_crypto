// context/AuthContext.js
'use client'
import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    username: null,
    access: null,
    refresh: null,
    isAuthenticated: false,
    isLoading: true // Добавляем состояние загрузки
  })

  useEffect(() => {
    const initializeAuth = () => {
      const access = localStorage.getItem('access')
      const username = localStorage.getItem('username')

      setAuth({
        username,
        access,
        refresh: localStorage.getItem('refresh'),
        isAuthenticated: !!access && !!username,
        isLoading: false
      })
    }

    initializeAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}