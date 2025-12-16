// services/AuthService.ts
// Single Responsibility: Manejo de autenticación

import apiClient from '@/lib/api'

export interface User {
  id: string
  email: string
  role?: string
  name?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export class AuthService {
  // Login con email y contraseña
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      })

      if (response.success && response.data) {
        // Almacenar token en el API client
        apiClient.setToken(response.data.token)
        if (response.data.refreshToken) {
          apiClient.setRefreshToken(response.data.refreshToken)
        }
        return response.data
      }

      throw new Error('No se pudo obtener el usuario')
    } catch (error) {
      throw error
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      apiClient.removeToken()
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = apiClient.getToken()
      if (!token) return null

      const response = await apiClient.get<{ user: User }>('/auth/me')

      if (response.success && response.data) {
        return response.data.user
      }

      return null
    } catch (error) {
      apiClient.removeToken()
      return null
    }
  }

  // Validar token
  static async validateToken(): Promise<boolean> {
    try {
      return await apiClient.validateToken()
    } catch (error) {
      return false
    }
  }
}
