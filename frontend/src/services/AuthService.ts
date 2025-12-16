// services/AuthService.ts
// Single Responsibility: Manejo de autenticación

import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export class AuthService {
  // Login con email y contraseña
  static async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (!data.user) throw new Error('No se pudo obtener el usuario')

    return data.user
  }

  // Logout
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Obtener usuario actual de Supabase Auth
  static async getCurrentAuthUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  }

  // Escuchar cambios en la autenticación
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })
  }
}
