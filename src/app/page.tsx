'use client'

// app/page.tsx
// Página de Login

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoginForm from '@/components/LoginForm'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  // Si hay usuario, no mostrar el formulario (se está redirigiendo)
  if (user) {
    return null
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
