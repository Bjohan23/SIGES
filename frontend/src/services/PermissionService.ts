// services/PermissionService.ts
// Single Responsibility: Verificación de permisos

import { supabase } from '@/lib/supabase'

export class PermissionService {
  // Verificar si un usuario tiene permiso para realizar una acción
  static async verificarPermiso(
    usuarioId: string,
    moduloCodigo: string,
    accion: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('verificar_permiso', {
        p_usuario_id: usuarioId,
        p_modulo_codigo: moduloCodigo,
        p_accion: accion,
      })

      if (error) {
        console.error('Error verificando permiso:', error)
        return false
      }

      return data ?? false
    } catch (error) {
      console.error('Error en verificarPermiso:', error)
      return false
    }
  }
}
