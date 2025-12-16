'use client'

// context/AuthContext.tsx
// Single Responsibility: Manejo del estado de autenticación global

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'
import { ErrorHandler } from '@/utils/errorHandler'
import type { AuthContextType, Usuario } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Cargar usuario al iniciar
  useEffect(() => {
    checkUser()
  }, [])

  // Verificar si hay usuario autenticado
  async function checkUser() {
    try {
      // Obtener usuario actual usando el nuevo servicio
      const userProfile = await UserService.getCurrentUserProfile()
      if (userProfile) {
        setUser(userProfile)
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Cargar perfil completo del usuario
  async function loadUserProfile(authUserId: string) {
    try {
      const userProfile = await UserService.getUserProfile(authUserId)
      setUser(userProfile)
    } catch (error) {
      console.error('Error al cargar perfil:', error)
      setUser(null)
    }
  }

  // Login
  async function login(email: string, password: string) {
    try {
      setLoading(true)
      const authResponse = await AuthService.login(email, password)
      // Obtener perfil completo del usuario después del login
      const userProfile = await UserService.getCurrentUserProfile()
      if (userProfile) {
        setUser(userProfile)
        router.push('/dashboard')
      } else {
        throw new Error('No se pudo cargar el perfil del usuario')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al iniciar sesión'
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Logout
  async function logout() {
    try {
      setLoading(true)
      await AuthService.logout()
      setUser(null)
      router.push('/')
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cerrar sesión'
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Refrescar datos del usuario
  async function refreshUser() {
    if (user) {
      await checkUser()
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
