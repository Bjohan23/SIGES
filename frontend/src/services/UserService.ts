// services/UserService.ts
// Single Responsibility: Manejo de datos de usuarios

import apiClient from '@/lib/api'
import type { Usuario } from '@/types'

export class UserService {
  // Obtener perfil completo del usuario (con rol)
  static async getUserProfile(authUserId: string): Promise<Usuario> {
    try {
      const response = await apiClient.get<Usuario>(`/users/profile/${authUserId}`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Usuario no encontrado')
    } catch (error) {
      throw error
    }
  }

  // Obtener ID del usuario desde la tabla usuarios
  static async getUserId(authUserId: string): Promise<string> {
    try {
      const response = await apiClient.get<{ id: string }>(`/users/id/${authUserId}`)

      if (response.success && response.data) {
        return response.data.id
      }

      throw new Error('Usuario no encontrado')
    } catch (error) {
      throw error
    }
  }

  // Obtener usuario actual con perfil completo
  static async getCurrentUserProfile(): Promise<Usuario | null> {
    try {
      const response = await apiClient.get<Usuario>('/users/me/profile')

      if (response.success && response.data) {
        return response.data
      }

      return null
    } catch (error) {
      return null
    }
  }
}
