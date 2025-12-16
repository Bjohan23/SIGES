import apiClient, { ApiResponse } from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni?: string;
  telefono?: string;
  activo: boolean;
  email_verificado: boolean;
  rol: {
    id: string;
    nombre: string;
  };
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
  tokenType: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthServiceBackend {
  private api = apiClient;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);

      if (response.success && response.data?.token) {
        // Guardar token en el cliente API
        this.api.setToken(response.data.token);

        // Guardar refresh token si existe
        if ((response.data as any).refreshToken) {
          this.api.setRefreshToken((response.data as any).refreshToken);
        }
      }

      return response.data!;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout
      const token = this.api.getToken();
      if (token) {
        await this.api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continuar con la limpieza local aunque la llamada falle
    } finally {
      // Limpiar tokens locales
      this.api.removeToken();
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      return await this.api.validateToken();
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/refresh');

      if (response.success && response.data?.token) {
        this.api.setToken(response.data.token);

        if ((response.data as any).refreshToken) {
          this.api.setRefreshToken((response.data as any).refreshToken);
        }
      }

      return response.data!;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      this.api.removeToken();
      return null;
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response = await this.api.post<void>('/auth/change-password', data);

      if (!response.success) {
        throw new Error('Error al cambiar contraseña');
      }
    } catch (error: any) {
      console.error('Change password failed:', error);
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<User>('/auth/profile');

      if (!response.success || !response.data) {
        throw new Error('Error al obtener perfil');
      }

      return response.data;
    } catch (error: any) {
      console.error('Get profile failed:', error);
      throw new Error(error.message || 'Error al obtener perfil');
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const token = this.api.getToken();
      if (!token) return false;

      // Validar token con el backend
      const isValid = await this.validateToken();

      if (!isValid) {
        // Intentar refresh si el token expiró
        const refreshed = await this.refreshToken();
        return !!refreshed;
      }

      return true;
    } catch (error) {
      console.error('Auth status check failed:', error);
      this.api.removeToken();
      return false;
    }
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.api.getToken();
    if (!token) return false;

    // Verificar expiración del token
    const expiry = this.getTokenExpiry();
    if (expiry && Date.now() > expiry) {
      this.api.removeToken();
      return false;
    }

    return true;
  }

  private getTokenExpiry(): number | null {
    if (typeof window === 'undefined') return null;

    try {
      const expiry = localStorage.getItem('auth_token_expiry');
      return expiry ? parseInt(expiry) : null;
    } catch (e) {
      return null;
    }
  }

  // Método para obtener el usuario actual
  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    // Opcional: Obtener perfil completo desde el backend
    // this.getProfile().catch(console.error);

    return null; // Por ahora, implementaremos esto en el contexto
  }
}

// Crear instancia única
const authServiceBackend = new AuthServiceBackend();

export default authServiceBackend;