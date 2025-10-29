'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isAuto: boolean
  setIsAuto: (auto: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isAuto, setIsAuto] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Determinar tema según la hora (6am-6pm = claro, 6pm-6am = oscuro)
  const getAutoTheme = useCallback((): Theme => {
    const hour = new Date().getHours()
    return hour >= 6 && hour < 18 ? 'light' : 'dark'
  }, [])

  // Aplicar tema al documento
  const applyTheme = useCallback((newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Inicializar tema
  useEffect(() => {
    setMounted(true)

    // Verificar preferencias guardadas
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const savedIsAuto = localStorage.getItem('themeAuto')

    if (savedIsAuto === 'false') {
      // Modo manual
      setIsAuto(false)
      const themeToUse = savedTheme || 'light'
      setTheme(themeToUse)
      applyTheme(themeToUse)
    } else {
      // Modo automático
      setIsAuto(true)
      const autoTheme = getAutoTheme()
      setTheme(autoTheme)
      applyTheme(autoTheme)
    }
  }, [getAutoTheme, applyTheme])

  // Verificar cada minuto si debe cambiar el tema automático
  useEffect(() => {
    if (!isAuto) return

    const interval = setInterval(() => {
      const autoTheme = getAutoTheme()
      if (autoTheme !== theme) {
        setTheme(autoTheme)
        applyTheme(autoTheme)
      }
    }, 60000) // Verificar cada minuto

    return () => clearInterval(interval)
  }, [isAuto, theme, getAutoTheme, applyTheme])

  // Toggle manual de tema
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)

    // Al hacer toggle manual, desactivar modo auto
    setIsAuto(false)
    localStorage.setItem('theme', newTheme)
    localStorage.setItem('themeAuto', 'false')
  }, [theme, applyTheme])

  // Cambiar entre modo auto y manual
  const handleSetIsAuto = useCallback((auto: boolean) => {
    setIsAuto(auto)
    localStorage.setItem('themeAuto', auto.toString())

    if (auto) {
      // Si activa modo auto, aplicar tema según hora
      const autoTheme = getAutoTheme()
      setTheme(autoTheme)
      applyTheme(autoTheme)
      localStorage.removeItem('theme')
    }
  }, [getAutoTheme, applyTheme])

  // Evitar flash de contenido no estilizado
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuto,
        setIsAuto: handleSetIsAuto
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
