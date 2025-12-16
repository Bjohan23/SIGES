// services/FamiliaDisfuncionalService.ts
// Single Responsibility: Operaciones CRUD de Familias Disfuncionales

import { supabase } from '@/lib/supabase'
import type { FamiliaDisfuncional } from '@/types'

export class FamiliaDisfuncionalService {
  // Listar todas las familias disfuncionales con filtros
  static async getFamilias(filtros?: {
    seguimiento_activo?: boolean
  }): Promise<any[]> {
    let query = supabase
      .from('vista_familias_disfuncionales_detalle')
      .select('*')
      .order('fecha_evaluacion', { ascending: false })

    if (filtros?.seguimiento_activo !== undefined) {
      query = query.eq('seguimiento_activo', filtros.seguimiento_activo)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  // Obtener una familia disfuncional por ID
  static async getFamiliaById(id: string): Promise<FamiliaDisfuncional> {
    const { data, error } = await supabase
      .from('familias_disfuncionales')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Familia disfuncional no encontrada')

    return data as FamiliaDisfuncional
  }

  // Marcar familia como disfuncional
  static async marcarComoDisfuncional(
    fichaId: string,
    datosEvaluacion: Partial<FamiliaDisfuncional>,
    usuarioId: string
  ): Promise<FamiliaDisfuncional> {
    const { data, error } = await supabase
      .from('familias_disfuncionales')
      .insert({
        ficha_social_id: fichaId,
        ...datosEvaluacion,
        evaluado_por: usuarioId,
      })
      .select()
      .single()

    if (error) throw error
    return data as FamiliaDisfuncional
  }

  // Actualizar familia disfuncional
  static async updateFamilia(
    id: string,
    familiaData: Partial<FamiliaDisfuncional>
  ): Promise<FamiliaDisfuncional> {
    const { data, error } = await supabase
      .from('familias_disfuncionales')
      .update(familiaData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as FamiliaDisfuncional
  }

  // Eliminar familia disfuncional
  static async deleteFamilia(id: string): Promise<void> {
    const { error } = await supabase
      .from('familias_disfuncionales')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
