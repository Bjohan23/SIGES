// services/FichaSocialService.ts
// Single Responsibility: Operaciones CRUD de Fichas Sociales

import { supabase } from '@/lib/supabase'
import type { FichaSocial } from '@/types'

export class FichaSocialService {
  // Listar todas las fichas con filtros opcionales
  static async getFichas(filtros?: {
    apellidos?: string
    estado?: string
    distrito?: string
  }): Promise<FichaSocial[]> {
    let query = supabase
      .from('vista_resumen_fichas')
      .select('*')
      .order('created_at', { ascending: false })

    if (filtros?.apellidos) {
      query = query.ilike('apellidos', `%${filtros.apellidos}%`)
    }

    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado)
    }

    if (filtros?.distrito) {
      query = query.eq('distrito', filtros.distrito)
    }

    const { data, error } = await query

    if (error) throw error
    return (data || []) as FichaSocial[]
  }

  // Obtener una ficha por ID
  static async getFichaById(id: string): Promise<FichaSocial> {
    const { data, error } = await supabase
      .from('vista_fichas_con_edad')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Ficha no encontrada')

    return data as FichaSocial
  }

  // Calcular porcentaje de completado
  private static calcularPorcentajeCompletado(fichaData: Partial<FichaSocial>): number {
    let completedFields = 0
    let totalFields = 32 // Total de campos obligatorios

    // Datos del estudiante (11 campos)
    if (fichaData.apellido_paterno) completedFields++
    if (fichaData.apellido_materno) completedFields++
    if (fichaData.nombres) completedFields++
    if (fichaData.sexo) completedFields++
    if (fichaData.fecha_nacimiento) completedFields++
    if (fichaData.nacionalidad) completedFields++
    if (fichaData.nacionalidad === 'Peruana' ? fichaData.dni : fichaData.carne_extranjeria) completedFields++
    if (fichaData.grado) completedFields++
    if (fichaData.seccion) completedFields++
    if (fichaData.domicilio_actual) completedFields++
    if (fichaData.distrito) completedFields++

    // Composición familiar (12 campos)
    if (fichaData.composicion_familiar) {
      const { padre, madre } = fichaData.composicion_familiar
      if (padre?.apellido_paterno) completedFields++
      if (padre?.apellido_materno) completedFields++
      if (padre?.nombres) completedFields++
      if (padre?.edad) completedFields++
      if (padre?.ocupacion) completedFields++
      if (padre?.celular) completedFields++
      if (madre?.apellido_paterno) completedFields++
      if (madre?.apellido_materno) completedFields++
      if (madre?.nombres) completedFields++
      if (madre?.edad) completedFields++
      if (madre?.ocupacion) completedFields++
      if (madre?.celular) completedFields++
    }

    // Situación económica (3 campos - al menos un ingreso)
    if (fichaData.datos_economicos) {
      const hasIncome = (fichaData.datos_economicos.ingresos.trabajador || 0) > 0 ||
                       (fichaData.datos_economicos.ingresos.conyuge || 0) > 0 ||
                       (fichaData.datos_economicos.ingresos.otros || 0) > 0
      if (hasIncome) completedFields += 3
    }

    // Vivienda y salud (3 campos)
    if (fichaData.datos_vivienda?.tipo_vivienda) completedFields++
    if (fichaData.datos_salud?.tipo_seguro) completedFields++
    if (fichaData.datos_salud?.grupo_sanguineo) completedFields++

    // Declaración jurada (3 campos)
    if (fichaData.declaracion_jurada?.acepta_terminos) completedFields++
    if (fichaData.declaracion_jurada?.nombre_firmante) completedFields++
    if (fichaData.declaracion_jurada?.firma_digital) completedFields++

    return Math.round((completedFields / totalFields) * 100)
  }

  // Crear nueva ficha
  static async createFicha(
    fichaData: Partial<FichaSocial>,
    usuarioId: string
  ): Promise<FichaSocial> {
    // Calcular porcentaje de completado
    const porcentaje = this.calcularPorcentajeCompletado(fichaData)

    // Construir apellidos completo para compatibilidad
    const apellidos = `${fichaData.apellido_paterno || ''} ${fichaData.apellido_materno || ''}`.trim()

    // Determinar estado según porcentaje
    const estado = porcentaje === 100 ? 'completa' : 'incompleta'

    const { data, error } = await supabase
      .from('fichas_sociales')
      .insert({
        ...fichaData,
        apellidos,
        porcentaje_completado: porcentaje,
        estado,
        created_by: usuarioId,
        updated_by: usuarioId,
      })
      .select()
      .single()

    if (error) throw error
    return data as FichaSocial
  }

  // Actualizar ficha existente
  static async updateFicha(
    id: string,
    fichaData: Partial<FichaSocial>,
    usuarioId: string
  ): Promise<FichaSocial> {
    // Calcular porcentaje de completado
    const porcentaje = this.calcularPorcentajeCompletado(fichaData)

    // Construir apellidos completo para compatibilidad
    const apellidos = `${fichaData.apellido_paterno || ''} ${fichaData.apellido_materno || ''}`.trim()

    // Determinar estado según porcentaje
    const estado = porcentaje === 100 ? 'completa' : 'incompleta'

    const { data, error } = await supabase
      .from('fichas_sociales')
      .update({
        ...fichaData,
        apellidos,
        porcentaje_completado: porcentaje,
        estado,
        updated_by: usuarioId,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as FichaSocial
  }

  // Eliminar ficha
  static async deleteFicha(id: string): Promise<void> {
    const { error } = await supabase
      .from('fichas_sociales')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
