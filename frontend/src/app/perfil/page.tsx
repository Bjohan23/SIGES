'use client'

// app/perfil/page.tsx
// Página de perfil de usuario

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { UserService } from '@/services/UserService'
import Navbar from '@/components/Navbar'
import ErrorAlert from '@/components/ErrorAlert'
import { fichaSocialAlerts } from '@/components/FichaSocialAlert'
import type { Usuario } from '@/types'

export default function PerfilPage() {
  const router = useRouter()
  const { user, loading: authLoading, updateUser } = useAuth()
  const [profile, setProfile] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError('')
        const profileData = await UserService.getCurrentUserProfile()
        if (profileData) {
          setProfile(profileData)
          setFormData({
            nombres: profileData.nombres || '',
            apellidos: profileData.apellidos || '',
            dni: profileData.dni || '',
            telefono: profileData.telefono || '',
          })
        }
      } catch (err: any) {
        console.error('Error al cargar perfil:', err)
        setError('No se pudo cargar el perfil del usuario')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      setError('')

      // Validar formulario
      if (!formData.nombres.trim() || !formData.apellidos.trim()) {
        setError('Los nombres y apellidos son obligatorios')
        return
      }

      if (formData.dni && formData.dni.length !== 8) {
        setError('El DNI debe tener 8 dígitos')
        return
      }

      if (formData.telefono && formData.telefono.length !== 9) {
        setError('El teléfono debe tener 9 dígitos')
        return
      }

      const updatedProfile = await UserService.updateCurrentUserProfile({
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        dni: formData.dni.trim(),
        telefono: formData.telefono.trim(),
      })

      setProfile(updatedProfile)

        // Actualizar el contexto de autenticación
        if (updateUser) {
          updateUser({
            ...user,
            nombres: updatedProfile.nombres,
            apellidos: updatedProfile.apellidos,
          })
        }

        fichaSocialAlerts.success(
          {
            id: updatedProfile.id,
            nombres: updatedProfile.nombres,
            apellidos: updatedProfile.apellidos,
            dni: updatedProfile.dni,
            distrito: '',
            estado: 'completa',
            porcentaje_completado: 100,
            created_at: updatedProfile.created_at,
            updated_at: updatedProfile.updated_at,
            creador: undefined,
            actualizador: undefined,
            _count: { entrevistas: 0 }
          },
          'Perfil actualizado correctamente',
          'Tu perfil ha sido actualizado exitosamente'
        )

        setIsEditing(false)
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err)
      setError(err.message || 'Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        nombres: profile.nombres || '',
        apellidos: profile.apellidos || '',
        dni: profile.dni || '',
        telefono: profile.telefono || '',
      })
    }
    setIsEditing(false)
    setError('')
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Loading */}
        {loading && !profile ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : profile && (
          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Información Personal
                </h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                  >
                    Editar Perfil
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombres
                    </label>
                    <input
                      type="text"
                      value={isEditing ? formData.nombres : profile.nombres}
                      onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Ingrese sus nombres"
                      title="Nombres completos del usuario"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={isEditing ? formData.apellidos : profile.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Ingrese sus apellidos"
                      title="Apellidos completos del usuario"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      placeholder="Correo electrónico"
                      title="Correo electrónico del usuario (no modificable)"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      El correo electrónico no se puede modificar
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      DNI
                    </label>
                    <input
                      type="text"
                      value={isEditing ? formData.dni : profile.dni}
                      onChange={(e) => setFormData({ ...formData, dni: e.target.value.replace(/\D/g, '').slice(0, 8) })}
                      disabled={!isEditing}
                      maxLength={8}
                      placeholder="DNI (8 dígitos)"
                      title="Documento Nacional de Identidad (8 dígitos numéricos)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={isEditing ? formData.telefono : profile.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                      disabled={!isEditing}
                      maxLength={9}
                      placeholder="Teléfono (9 dígitos)"
                      title="Número de teléfono celular (9 dígitos numéricos)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rol
                    </label>
                    <input
                      type="text"
                      value={profile.rol_nombre || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {profile.rol_descripcion}
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Información de la cuenta */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                Información de la Cuenta
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado de la cuenta</p>
                  <p className="text-sm font-medium">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile.activo
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {profile.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email verificado</p>
                  <p className="text-sm font-medium">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile.email_verificado
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {profile.email_verificado ? 'Verificado' : 'No verificado'}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fecha de creación</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(profile.created_at).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Último inicio de sesión</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {profile.ultimo_acceso
                      ? new Date(profile.ultimo_acceso).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'No registrado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}