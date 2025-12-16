import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Cliente API optimizado para comunicación con el backend SIGES
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    isOperational: boolean;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private requestInterceptors: number[] = [];
  private responseInterceptors: number[] = [];

  constructor() {
    // Configuración optimizada de Axios
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 segundos timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Seguridad: Evitar envío automático de cookies
      withCredentials: false,
      // Validación de status
      validateStatus: (status) => status >= 200 && status < 300,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de request - añade token y seguridad
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Añadir timestamp para prevenir cache
        config.headers['X-Request-Timestamp'] = Date.now().toString();

        // Añadir token de autenticación
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Añadir fingerprint de seguridad
        if (typeof window !== 'undefined') {
          config.headers['X-Client-Fingerprint'] = this.generateFingerprint();
        }

        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de response - manejo de errores y optimización
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }

        // Optimización: Cache de respuestas estáticas si es necesario
        if (this.shouldCache(response)) {
          this.cacheResponse(response);
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Log de errores
        console.error('❌ API Error:', {
          url: originalRequest?.url,
          status: error.response?.status,
          message: error.message,
          code: error.code,
        });

        // Manejo de token expirado
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          // Intentar refresh token
          try {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              const token = this.getToken();
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.axiosInstance(originalRequest);
              }
            }
          } catch (refreshError) {
            // Refresh falló, limpiar token
            this.removeToken();
            // Redirigir a login si está en el browser
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }
        }

        // Retraso exponencial para retry
        if (this.shouldRetry(error)) {
          await this.delay(this.getRetryDelay(error));
          return this.axiosInstance(originalRequest!);
        }

        // Formatear error
        const formattedError = this.formatError(error);
        return Promise.reject(formattedError);
      }
    );
  }

  private generateFingerprint(): string {
    if (typeof window === 'undefined') return 'server';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const text = 'navigator.userAgent:' + navigator.userAgent +
                  'screen.width:' + screen.width +
                  'screen.height:' + screen.height;
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText(text, 2, 2);

    return canvas.toDataURL().slice(-50);
  }

  private shouldCache(response: AxiosResponse): boolean {
    // Solo cachear responses GET exitosas y estáticas
    return response.config.method === 'get' &&
           response.status === 200 &&
           response.config.url?.includes('/health') ||
           response.config.url?.includes('/version');
  }

  private cacheResponse(response: AxiosResponse): void {
    // Implementar cache simple con localStorage si es necesario
    const key = `cache_${response.config.url}`;
    const data = {
      data: response.data,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000, // 5 minutos
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        // Ignorar errores de localStorage
      }
    }
  }

  private shouldRetry(error: AxiosError): boolean {
    // Solo retry en errores de red o 5xx
    if (!error.config) return false;
    if (error.config._retryCount >= 3) return false;

    return (
      !error.response || // Error de red
      (error.response.status >= 500 && error.response.status < 600) || // Server error
      error.response.status === 429 // Rate limit
    );
  }

  private getRetryDelay(error: AxiosError): number {
    // Retraso exponencial con jitter
    const baseDelay = 1000;
    const maxDelay = 10000;
    const retryCount = (error.config?._retryCount || 0) + 1;
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
    const jitter = Math.random() * 1000;

    return delay + jitter;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private formatError(error: AxiosError): Error {
    if (error.response) {
      const message = error.response.data?.error?.message ||
                    error.response.data?.message ||
                    `HTTP ${error.response.status}: ${error.statusText}`;

      const apiError = new Error(message) as any;
      apiError.status = error.response.status;
      apiError.code = error.code;
      apiError.config = error.config;
      apiError.response = error.response;

      return apiError;
    }

    if (error.request) {
      const networkError = new Error('Network error. Please check your connection.') as any;
      networkError.code = 'NETWORK_ERROR';
      networkError.config = error.config;

      return networkError;
    }

    return error;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      // Implementar refresh token si el backend lo soporta
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { token } = response.data.data;
      this.setToken(token);

      return true;
    } catch (error) {
      return false;
    }
  }

  // Métodos HTTP optimizados con tipado fuerte
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      params,
    };

    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      method: 'POST',
      data,
      ...config,
    };

    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(endpoint, requestConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      method: 'PUT',
      data,
      ...config,
    };

    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(endpoint, requestConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      method: 'PATCH',
      data,
      ...config,
    };

    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(endpoint, requestConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      method: 'DELETE',
      ...config,
    };

    try {
      const response = await this.axiosInstance.request<ApiResponse<T>>(endpoint, requestConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Métodos de autenticación seguros
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      // Almacenar en memoria y localStorage para mayor seguridad
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        localStorage.setItem('auth_token', token);
        // Establecer tiempo de expiración
        const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
        localStorage.setItem('auth_token_expiry', expiry.toString());
      } catch (e) {
        console.warn('Failed to store auth token:', e);
      }
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const token = localStorage.getItem('auth_token');
      const expiry = localStorage.getItem('auth_token_expiry');

      // Verificar expiración
      if (token && expiry) {
        const expiryTime = parseInt(expiry);
        if (Date.now() > expiryTime) {
          this.removeToken();
          return null;
        }
      }

      return token;
    } catch (e) {
      console.warn('Failed to retrieve auth token:', e);
      return null;
    }
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem('refresh_token');
    } catch (e) {
      return null;
    }
  }

  setRefreshToken(refreshToken: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('refresh_token', refreshToken);
      } catch (e) {
        console.warn('Failed to store refresh token:', e);
      }
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      delete this.axiosInstance.defaults.headers.common['Authorization'];

      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_expiry');
        localStorage.removeItem('refresh_token');
      } catch (e) {
        console.warn('Failed to remove auth tokens:', e);
      }
    }
  }

  // Validación de token
  async validateToken(): Promise<boolean> {
    try {
      const response = await this.get<{ valid: boolean }>('/auth/validate');
      return response.data?.valid || false;
    } catch (error) {
      this.removeToken();
      return false;
    }
  }

  // Cancelación de requests
  createCancelToken(): () => void {
    const controller = new AbortController();
    return () => controller.abort();
  }

  // Health check optimizado
  async healthCheck(): Promise<boolean> {
    try {
      // Usar HEAD para mejor rendimiento
      await this.axiosInstance.head('/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Método para limpiar interceptores (útil para testing)
  cleanup(): void {
    this.requestInterceptors.forEach(id => {
      this.axiosInstance.interceptors.request.eject(id);
    });
    this.responseInterceptors.forEach(id => {
      this.axiosInstance.interceptors.response.eject(id);
    });
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }
}

// Crear instancia única del cliente con patrón singleton
let apiClientInstance: ApiClient | null = null;

export const apiClient = (): ApiClient => {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient();
  }
  return apiClientInstance;
};

// Exportar instancia por defecto para compatibilidad
const client = apiClient();
export default client;