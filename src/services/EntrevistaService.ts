// services/EntrevistaService.ts
// Single Responsibility: Operaciones CRUD de Entrevistas

import { supabase } from '@/lib/supabase'
import type { EntrevistaAplicada } from '@/types'

export class EntrevistaService {
  // Listar todas las entrevistas con filtros opcionales
  static async getEntrevistas(filtros?: {
    grado?: string
    estado?: string
  }): Promise<EntrevistaAplicada[]> {
    let query = supabase
      .from('vista_entrevistas_completas')
      .select('*')
      .order('created_at', { ascending: false })

    if (filtros?.grado) {
      query = query.eq('grado', filtros.grado)
    }

    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado)
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []) as EntrevistaAplicada[]
  }

  // Obtener una entrevista por ID
  static async getEntrevistaById(id: string): Promise<EntrevistaAplicada> {
    const { data, error } = await supabase
      .from('entrevistas_aplicadas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Entrevista no encontrada')

    return data as EntrevistaAplicada
  }

  // Crear nueva entrevista
  static async createEntrevista(
    entrevistaData: Partial<EntrevistaAplicada>,
    usuarioId: string
  ): Promise<EntrevistaAplicada> {
    const { data, error } = await supabase
      .from('entrevistas_aplicadas')
      .insert({
        ...entrevistaData,
        created_by: usuarioId,
        updated_by: usuarioId,
      })
      .select()
      .single()

    if (error) throw error
    return data as EntrevistaAplicada
  }

  // Actualizar entrevista existente
  static async updateEntrevista(
    id: string,
    entrevistaData: Partial<EntrevistaAplicada>,
    usuarioId: string
  ): Promise<EntrevistaAplicada> {
    const { data, error } = await supabase
      .from('entrevistas_aplicadas')
      .update({
        ...entrevistaData,
        updated_by: usuarioId,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as EntrevistaAplicada
  }

  // Eliminar entrevista
  static async deleteEntrevista(id: string): Promise<void> {
    const { error } = await supabase
      .from('entrevistas_aplicadas')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
