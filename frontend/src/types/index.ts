// types/index.ts
// Tipos de datos de la aplicación

export interface User {
  id: string
  email: string
  password: string
  nombres: string
  apellidos: string
  dni: string
  telefono: string
  activo: boolean
  email_verificado: boolean
  ultimo_login: string
  created_at: string
  updated_at: string
  rol_id: string
  rol?: {
    id: string
    nombre: string
    descripcion: string
  }
}

export interface Usuario {
  id: string
  auth_user_id: string
  email: string
  nombre_completo: string
  telefono?: string
  activo: boolean
  ultimo_acceso?: string
  rol_id: string
  rol_nombre?: string
  rol_descripcion?: string
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: Usuario | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// Tipos para datos anidados en JSONB
export interface ComposicionFamiliar {
  padre: {
    apellido_paterno: string
    apellido_materno: string
    nombres: string
    edad: number | null
    ocupacion: string
    centro_laboral: string
    celular: string
  }
  madre: {
    apellido_paterno: string
    apellido_materno: string
    nombres: string
    edad: number | null
    ocupacion: string
    centro_laboral: string
    celular: string
  }
}

export interface DatosVivienda {
  tipo_vivienda?: string
  material: string[]
  tenencia: string[]
  servicios: string[]
  ubicacion: string[]
  problemas_sociales: string[]
}

export interface DatosSalud {
  tipo_seguro?: string
  alergias: {
    tiene: boolean
    especificar?: string
  }
  enfermedades: {
    tiene: boolean
    especificar?: string
  }
  medicamentos: string[]
  grupo_sanguineo?: string
  discapacidad?: {
    tiene: boolean
    tipo?: string
    grado?: string
  }
}

export interface DatosEconomicos {
  ingresos: {
    trabajador: number
    conyuge: number
    otros: number
  }
  egresos: {
    servicios_basicos: {
      agua: number
      luz: number
      telefono: number
      internet: number
      cable: number
    }
    gastos_familiares: {
      alimentacion: number
      educacion: number
      salud: number
      transporte: number
      vestimenta: number
    }
    deudas_seguros: {
      prestamos: number
      seguros: number
    }
  }
}

export interface DeclaracionJurada {
  acepta_terminos: boolean
  nombre_firmante: string
  firma_digital?: string
  fecha_firma: string | null
}

export interface FichaSocial {
  id: string
  apellidos: string // Mantener por compatibilidad
  apellido_paterno: string
  apellido_materno: string
  nombres: string
  edad?: number
  sexo: 'M' | 'F'
  nacionalidad: string
  fecha_nacimiento: string
  dni?: string
  carne_extranjeria?: string
  grado?: string
  seccion?: string
  nivel_educativo?: string
  estado_civil?: 'soltero' | 'conviviente' | 'casado' | 'separado' | 'viudo'
  num_hijos?: number
  domicilio_actual?: string
  distrito?: string
  composicion_familiar?: ComposicionFamiliar
  datos_vivienda?: DatosVivienda
  datos_salud?: DatosSalud
  datos_economicos?: DatosEconomicos
  declaracion_jurada?: DeclaracionJurada
  estado: 'incompleta' | 'completa' | 'disfuncional'
  porcentaje_completado: number
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface EntrevistaAplicada {
  id: string
  ficha_social_id?: string
  estudiante_nombres: string
  estudiante_apellidos: string
  estudiante_edad: number
  estudiante_fecha_nacimiento: string
  aula: string
  grado: string
  respuestas: any
  estado: 'incompleta' | 'completa'
  porcentaje_completado: number
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface FamiliaDisfuncional {
  id: string
  ficha_social_id: string
  entrevista_id?: string
  fecha_evaluacion: string
  observaciones?: string
  criterios_evaluacion?: string
  indicadores?: any
  requiere_seguimiento: boolean
  seguimiento_activo: boolean
  notas_seguimiento?: string
  evaluado_por: string
  created_at: string
  updated_at: string
}

export interface Estadisticas {
  total_fichas: number
  fichas_completas: number
  fichas_pendientes: number
  familias_disfuncionales: number
  total_entrevistas: number
  entrevistas_completas: number
  usuarios_activos: number
}
