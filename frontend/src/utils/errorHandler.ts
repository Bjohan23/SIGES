// utils/errorHandler.ts
// Single Responsibility: Manejo centralizado de errores

export class ErrorHandler {
  static handleApiError(error: any): string {
    console.error('Error de API:', error)

    // Errores de respuesta HTTP
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.error?.message || error.response.data?.message

      switch (status) {
        case 400:
          return message || 'Solicitud inválida'
        case 401:
          return 'No autorizado. Por favor, inicia sesión.'
        case 403:
          return 'No tienes permisos para realizar esta acción'
        case 404:
          return 'No se encontró el recurso solicitado'
        case 409:
          return message || 'Conflicto: el recurso ya existe'
        case 422:
          return message || 'Datos inválidos o incompletos'
        case 429:
          return 'Demasiadas solicitudes. Intenta más tarde.'
        case 500:
          return 'Error del servidor. Intenta más tarde.'
        default:
          return message || `Error ${status}. Intenta nuevamente.`
      }
    }

    // Errores de red
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    }

    // Errores de autenticación
    if (error.message?.includes('Unauthorized') || error.message?.includes('Invalid credentials')) {
      return 'Usuario o contraseña incorrectos'
    }

    if (error.message?.includes('Token expired')) {
      return 'Tu sesión ha expirado. Inicia sesión nuevamente.'
    }

    if (error.message?.includes('Email not confirmed')) {
      return 'Debes confirmar tu correo electrónico'
    }

    return error.message || 'Error desconocido. Intenta nuevamente.'
  }

  
  // Manejo de errores específicos
  static handleAuthError(error: any): string {
    if (error.message?.includes('Invalid login credentials')) {
      return 'Usuario o contraseña incorrectos'
    }
    if (error.message?.includes('User not found')) {
      return 'Usuario no encontrado'
    }
    if (error.message?.includes('Invalid password')) {
      return 'Contraseña incorrecta'
    }
    if (error.message?.includes('Email already in use')) {
      return 'El correo electrónico ya está registrado'
    }
    return this.handleApiError(error)
  }

  static handleValidationError(error: any): string {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors
      if (Array.isArray(errors)) {
        return errors.join(', ')
      }
    }
    return this.handleApiError(error)
  }
}
