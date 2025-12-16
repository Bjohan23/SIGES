'use client'

// components/LoginForm.tsx
// Single Responsibility: Formulario de login

import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import Logo from './Logo'
import InputField from './InputField'
import ErrorAlert from './ErrorAlert'
import Button from './Button'

export default function LoginForm() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  })

  const clearErrors = () => {
    setErrors({ email: '', password: '', general: '' })
  }

  const validateForm = (): boolean => {
    clearErrors()
    let isValid = true
    const newErrors = { email: '', password: '', general: '' }

    // Validar email
    if (!email.trim()) {
      newErrors.email = 'El campo email es obligatorio'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingresa un email válido'
      isValid = false
    }

    // Validar contraseña
    if (!password.trim()) {
      newErrors.password = 'El campo contraseña es obligatorio'
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
      isValid = false
    }

    if (!isValid) {
      newErrors.general = 'Por favor, completa todos los campos correctamente'
      setErrors(newErrors)
    }

    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await login(email, password)
    } catch (error: any) {
      setErrors({
        ...errors,
        general: error.message || 'Error al iniciar sesión',
      })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-8 transition-colors">
      <Logo />

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            clearErrors()
          }}
          error={errors.email}
          placeholder="correo@ejemplo.com"
          icon={
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          }
        />

        <InputField
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            clearErrors()
          }}
          error={errors.password}
          placeholder="Ingrese su contraseña"
          icon={
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          }
        />

        {errors.general && <ErrorAlert message={errors.general} />}

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'INGRESANDO...' : 'INGRESAR'}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2024 I.E. Nicolás La Torre García</p>
        <p className="text-xs mt-1">Chiclayo, Perú</p>
      </div>
    </div>
  )
}
