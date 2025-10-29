// utils/errorHandler.ts
// Single Responsibility: Manejo centralizado de errores

export class ErrorHandler {
  static handleSupabaseError(error: any): string {
    console.error('Error de Supabase:', error)

    // Errores comunes de Supabase
    if (error.code === 'PGRST116') {
      return 'No se encontró el registro'
    }

    if (error.code === '23505') {
      return 'El registro ya existe'
    }

    if (error.code === '42501') {
      return 'No tienes permisos para realizar esta acción'
    }

    // Errores de autenticación
    if (error.message?.includes('Invalid login credentials')) {
      return 'Usuario o contraseña incorrectos'
    }

    if (error.message?.includes('Email not confirmed')) {
      return 'Debes confirmar tu correo electrónico'
    }

    return error.message || 'Error desconocido. Intenta nuevamente.'
  }
}
