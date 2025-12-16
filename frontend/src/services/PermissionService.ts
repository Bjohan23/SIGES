// services/PermissionService.ts
// Single Responsibility: Verificación de permisos

import apiClient from '@/lib/api'

export class PermissionService {
  // Verificar si un usuario tiene permiso para realizar una acción
  static async verificarPermiso(
    usuarioId: string,
    moduloCodigo: string,
    accion: string
  ): Promise<boolean> {
    try {
      const response = await apiClient.post<{ hasPermission: boolean }>('/permissions/check', {
        usuarioId,
        moduloCodigo,
        accion,
      })

      if (response.success && response.data) {
        return response.data.hasPermission
      }

      return false
    } catch (error) {
      console.error('Error verificando permiso:', error)
      return false
    }
  }

  // Obtener todos los permisos del usuario actual
  static async getCurrentUserPermissions(): Promise<string[]> {
    try {
      const response = await apiClient.get<{ permissions: string[] }>('/permissions/me')

      if (response.success && response.data) {
        return response.data.permissions
      }

      return []
    } catch (error) {
      console.error('Error obteniendo permisos del usuario:', error)
      return []
    }
  }

  // Verificar si el usuario actual tiene un permiso específico
  static async hasPermission(accion: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasPermission: boolean }>(`/permissions/check/${accion}`)

      if (response.success && response.data) {
        return response.data.hasPermission
      }

      return false
    } catch (error) {
      console.error('Error verificando permiso:', error)
      return false
    }
  }
}
