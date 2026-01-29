// utils/date.ts
// Utilidades centralizadas para manejo de fechas

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param fechaNacimiento - Fecha en formato string, null o undefined
 * @returns La edad en años o null si no hay fecha
 */
export function calculateAge(fechaNacimiento: string | null | undefined): number | null {
  if (!fechaNacimiento) return null

  const today = new Date()
  const birthDate = new Date(fechaNacimiento)

  // Validar que la fecha sea válida
  if (isNaN(birthDate.getTime())) return null

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

/**
 * Formatea una fecha en formato legible en español
 * @param dateString - Fecha en formato string, null o undefined
 * @param fallback - Texto a mostrar si no hay fecha (default: 'No registrado')
 * @returns Fecha formateada o el texto fallback
 */
export function formatDate(
  dateString: string | null | undefined,
  fallback: string = 'No registrado'
): string {
  if (!dateString) return fallback

  const date = new Date(dateString)

  // Validar que la fecha sea válida
  if (isNaN(date.getTime())) return fallback

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 * @param dateString - Fecha en formato string, null o undefined
 * @param fallback - Texto a mostrar si no hay fecha (default: '-')
 * @returns Fecha formateada o el texto fallback
 */
export function formatDateShort(
  dateString: string | null | undefined,
  fallback: string = '-'
): string {
  if (!dateString) return fallback

  const date = new Date(dateString)

  // Validar que la fecha sea válida
  if (isNaN(date.getTime())) return fallback

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Formatea una fecha con hora
 * @param dateString - Fecha en formato string, null o undefined
 * @param fallback - Texto a mostrar si no hay fecha (default: '-')
 * @returns Fecha y hora formateadas o el texto fallback
 */
export function formatDateTime(
  dateString: string | null | undefined,
  fallback: string = '-'
): string {
  if (!dateString) return fallback

  const date = new Date(dateString)

  // Validar que la fecha sea válida
  if (isNaN(date.getTime())) return fallback

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
