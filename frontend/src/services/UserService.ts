// services/UserService.ts
// Single Responsibility: Manejo de datos de usuarios

import { supabase } from '@/lib/supabase'
import type { Usuario } from '@/types'

export class UserService {
  // Obtener perfil completo del usuario (con rol)
  static async getUserProfile(authUserId: string): Promise<Usuario> {
    const { data, error } = await supabase
      .from('vista_usuarios_completa')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Usuario no encontrado')

    return data as Usuario
  }

  // Obtener ID del usuario desde la tabla usuarios
  static async getUserId(authUserId: string): Promise<string> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_user_id', authUserId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Usuario no encontrado')

    return data.id
  }
}
