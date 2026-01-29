// components/FichaSocialAlert.tsx
// Componente para mostrar alertas detalladas de fichas sociales

import toast, { Toast, Toaster } from 'react-hot-toast'
import type { FichaSocial } from '@/types'

// Tipo para ficha con propiedades opcionales para alertas
type FichaSocialPartial = Partial<FichaSocial> & {
  porcentaje_completado: number
  estado: string
  _count?: { entrevistas: number }
}

interface FichaSocialAlertProps {
  ficha: FichaSocialPartial
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
}

export function FichaSocialAlert({ ficha, type, title, message }: FichaSocialAlertProps) {
  const getAlertStyles = () => {
    const styles = {
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
    return styles[type] || styles.info
  }

  const getIconColor = () => {
    const colors = {
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400'
    }
    return colors[type] || colors.info
  }

  const getEstadoColor = () => {
    const colors = {
      'completa': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'incompleta': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'disfuncional': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    }
    return colors[ficha.estado as keyof typeof colors] || colors['incompleta']
  }

  const getProgressColor = () => {
    if (ficha.porcentaje_completado === 100) return 'bg-green-500'
    if (ficha.porcentaje_completado >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className={`max-w-md w-full p-4 rounded-lg border ${getAlertStyles()} shadow-lg`}>
      <div className="flex items-start space-x-3">
        {/* Icono */}
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          {type === 'success' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'error' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {type === 'info' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Título */}
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </p>

          {/* Mensaje adicional si existe */}
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {message}
            </p>
          )}

          {/* Información de la ficha social */}
          <div className="mt-3 space-y-2 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Nombre:</span>
              <span className="text-xs text-gray-900 dark:text-gray-100">
                {ficha.nombres} {ficha.apellidos}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">DNI:</span>
              <span className="text-xs text-gray-900 dark:text-gray-100">
                {ficha.dni || 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Estado:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor()}`}>
                {ficha.estado}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progreso:</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {ficha.porcentaje_completado}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${ficha.porcentaje_completado}%` }}
                />
              </div>
            </div>

            {ficha.distrito && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Distrito:</span>
                <span className="text-xs text-gray-900 dark:text-gray-100">
                  {ficha.distrito}
                </span>
              </div>
            )}

            {/* Alerta específica para estado incompleta con 100% de progreso */}
            {ficha.estado === 'incompleta' && ficha.porcentaje_completado === 100 && (
              <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  La ficha muestra 100% de progreso pero aún está marcada como incompleta.
                  {ficha._count?.entrevistas === 0 ? ' Requiere al menos una entrevista.' : ' Verifique los datos faltantes.'}
                </p>
              </div>
            )}

            {ficha._count && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Entrevistas:</span>
                <span className="text-xs text-gray-900 dark:text-gray-100">
                  {ficha._count.entrevistas || 0}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Creada: {ficha.created_at ? new Date(ficha.created_at).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Fecha no disponible'}
          </p>
        </div>
      </div>
    </div>
  )
}

// Funciones helper para mostrar las alertas
export const fichaSocialAlerts = {
  success: (ficha: FichaSocialPartial, title: string, message?: string) => {
    toast.custom((t: Toast) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-exit'}`}>
        <FichaSocialAlert ficha={ficha} type="success" title={title} message={message} />
      </div>
    ), {
      duration: 5000,
      position: 'top-right'
    })
  },

  error: (ficha: FichaSocialPartial, title: string, message?: string) => {
    toast.custom((t: Toast) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-exit'}`}>
        <FichaSocialAlert ficha={ficha} type="error" title={title} message={message} />
      </div>
    ), {
      duration: 7000,
      position: 'top-right'
    })
  },

  warning: (ficha: FichaSocialPartial, title: string, message?: string) => {
    toast.custom((t: Toast) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-exit'}`}>
        <FichaSocialAlert ficha={ficha} type="warning" title={title} message={message} />
      </div>
    ), {
      duration: 6000,
      position: 'top-right'
    })
  },

  info: (ficha: FichaSocialPartial, title: string, message?: string) => {
    toast.custom((t: Toast) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-exit'}`}>
        <FichaSocialAlert ficha={ficha} type="info" title={title} message={message} />
      </div>
    ), {
      duration: 5000,
      position: 'top-right'
    })
  }
}

// Componente Toaster para ser incluido en la app
export default function FichaSocialToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 80,
        right: 20,
      }}
      toastOptions={{
        duration: 5000,
        style: {
          background: 'transparent',
          padding: 0,
          boxShadow: 'none',
        },
      }}
    />
  )
}