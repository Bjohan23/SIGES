'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { FichaSocial, ComposicionFamiliar, DatosVivienda, DatosSalud, DatosEconomicos, DeclaracionJurada } from '@/types'

interface FormData {
  // Pestaña 1: Datos del Estudiante
  apellido_paterno: string
  apellido_materno: string
  nombres: string
  sexo: 'M' | 'F' | ''
  fecha_nacimiento: string
  edad: number | null
  nacionalidad: string
  dni: string
  carne_extranjeria: string
  grado: string
  seccion: string
  nivel_educativo: string
  estado_civil: string
  num_hijos: number
  domicilio_actual: string
  distrito: string

  // Pestaña 2: Composición Familiar
  composicion_familiar: ComposicionFamiliar

  // Pestaña 3: Situación Económica
  datos_economicos: DatosEconomicos

  // Pestaña 4: Vivienda y Salud
  datos_vivienda: DatosVivienda
  datos_salud: DatosSalud

  // Pestaña 5: Declaración Jurada
  declaracion_jurada: DeclaracionJurada
}

interface FormErrors {
  [key: string]: string
}

interface FichaSocialFormContextType {
  formData: FormData
  errors: FormErrors
  currentStep: number
  updateFormData: (field: string, value: any) => void
  updateNestedField: (path: string, value: any) => void
  setCurrentStep: (step: number) => void
  validateStep: (step: number) => boolean
  getProgress: () => number
  canProceed: () => boolean
  resetForm: () => void
}

const FichaSocialFormContext = createContext<FichaSocialFormContextType | undefined>(undefined)

const initialFormData: FormData = {
  apellido_paterno: '',
  apellido_materno: '',
  nombres: '',
  sexo: '',
  fecha_nacimiento: '',
  edad: null,
  nacionalidad: 'Peruana',
  dni: '',
  carne_extranjeria: '',
  grado: '',
  seccion: '',
  nivel_educativo: '',
  estado_civil: 'soltero',
  num_hijos: 0,
  domicilio_actual: '',
  distrito: '',
  composicion_familiar: {
    padre: {
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      edad: null,
      ocupacion: '',
      centro_laboral: '',
      celular: ''
    },
    madre: {
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      edad: null,
      ocupacion: '',
      centro_laboral: '',
      celular: ''
    }
  },
  datos_economicos: {
    ingresos: {
      trabajador: 0,
      conyuge: 0,
      otros: 0
    },
    egresos: {
      servicios_basicos: {
        agua: 0,
        luz: 0,
        telefono: 0,
        internet: 0,
        cable: 0
      },
      gastos_familiares: {
        alimentacion: 0,
        educacion: 0,
        salud: 0,
        transporte: 0,
        vestimenta: 0
      },
      deudas_seguros: {
        prestamos: 0,
        seguros: 0
      }
    }
  },
  datos_vivienda: {
    tipo_vivienda: '',
    material: [],
    tenencia: [],
    servicios: [],
    ubicacion: [],
    problemas_sociales: []
  },
  datos_salud: {
    tipo_seguro: '',
    alergias: {
      tiene: false,
      especificar: ''
    },
    enfermedades: {
      tiene: false,
      especificar: ''
    },
    medicamentos: [],
    grupo_sanguineo: '',
    discapacidad: {
      tiene: false,
      tipo: '',
      grado: ''
    }
  },
  declaracion_jurada: {
    acepta_terminos: false,
    nombre_firmante: '',
    firma_digital: '',
    fecha_firma: null
  }
}

export function FichaSocialFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [currentStep, setCurrentStep] = useState(0)

  // Calcular edad automáticamente cuando cambia la fecha de nacimiento
  const calculateAge = useCallback((birthDate: string): number | null => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }, [])

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Calcular edad automáticamente si cambia fecha de nacimiento
      if (field === 'fecha_nacimiento') {
        updated.edad = calculateAge(value)
      }

      return updated
    })

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors, calculateAge])

  const updateNestedField = useCallback((path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current: any = newData

      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {}
        } else {
          current[keys[i]] = { ...current[keys[i]] }
        }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newData
    })
  }, [])

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: FormErrors = {}

    switch (step) {
      case 0: // Datos del Estudiante
        if (!formData.apellido_paterno.trim()) newErrors.apellido_paterno = 'Apellido paterno es obligatorio'
        if (!formData.apellido_materno.trim()) newErrors.apellido_materno = 'Apellido materno es obligatorio'
        if (!formData.nombres.trim()) newErrors.nombres = 'Nombres son obligatorios'
        if (!formData.sexo) newErrors.sexo = 'Sexo es obligatorio'
        if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'Fecha de nacimiento es obligatoria'
        if (!formData.nacionalidad.trim()) newErrors.nacionalidad = 'Nacionalidad es obligatoria'

        if (formData.nacionalidad === 'Peruana') {
          if (!formData.dni.trim()) {
            newErrors.dni = 'DNI es obligatorio'
          } else if (!/^\d{8}$/.test(formData.dni)) {
            newErrors.dni = 'DNI debe tener 8 dígitos'
          }
        } else {
          if (!formData.carne_extranjeria.trim()) {
            newErrors.carne_extranjeria = 'Carné de extranjería es obligatorio'
          }
        }

        if (!formData.grado.trim()) newErrors.grado = 'Grado es obligatorio'
        if (!formData.seccion.trim()) newErrors.seccion = 'Sección es obligatoria'
        if (!formData.domicilio_actual.trim()) newErrors.domicilio_actual = 'Domicilio es obligatorio'
        if (!formData.distrito.trim()) newErrors.distrito = 'Distrito es obligatorio'
        break

      case 1: // Composición Familiar
        const { padre, madre } = formData.composicion_familiar

        // Validar datos del padre
        if (!padre.apellido_paterno.trim()) newErrors['padre.apellido_paterno'] = 'Apellido paterno del padre es obligatorio'
        if (!padre.apellido_materno.trim()) newErrors['padre.apellido_materno'] = 'Apellido materno del padre es obligatorio'
        if (!padre.nombres.trim()) newErrors['padre.nombres'] = 'Nombres del padre son obligatorios'
        if (!padre.edad) newErrors['padre.edad'] = 'Edad del padre es obligatoria'
        if (!padre.ocupacion.trim()) newErrors['padre.ocupacion'] = 'Ocupación del padre es obligatoria'
        if (!padre.celular.trim()) newErrors['padre.celular'] = 'Celular del padre es obligatorio'

        // Validar datos de la madre
        if (!madre.apellido_paterno.trim()) newErrors['madre.apellido_paterno'] = 'Apellido paterno de la madre es obligatorio'
        if (!madre.apellido_materno.trim()) newErrors['madre.apellido_materno'] = 'Apellido materno de la madre es obligatorio'
        if (!madre.nombres.trim()) newErrors['madre.nombres'] = 'Nombres de la madre son obligatorios'
        if (!madre.edad) newErrors['madre.edad'] = 'Edad de la madre es obligatoria'
        if (!madre.ocupacion.trim()) newErrors['madre.ocupacion'] = 'Ocupación de la madre es obligatoria'
        if (!madre.celular.trim()) newErrors['madre.celular'] = 'Celular de la madre es obligatorio'
        break

      case 2: // Situación Económica
        // Los valores numéricos pueden ser 0, así que solo validamos que existan
        if (formData.datos_economicos.ingresos.trabajador < 0) newErrors['ingresos.trabajador'] = 'Ingreso no puede ser negativo'
        if (formData.datos_economicos.ingresos.conyuge < 0) newErrors['ingresos.conyuge'] = 'Ingreso no puede ser negativo'
        if (formData.datos_economicos.ingresos.otros < 0) newErrors['ingresos.otros'] = 'Ingreso no puede ser negativo'
        break

      case 3: // Vivienda y Salud
        if (!formData.datos_vivienda.tipo_vivienda) newErrors['tipo_vivienda'] = 'Tipo de vivienda es obligatorio'
        if (!formData.datos_salud.tipo_seguro) newErrors['tipo_seguro'] = 'Tipo de seguro es obligatorio'
        if (!formData.datos_salud.grupo_sanguineo) newErrors['grupo_sanguineo'] = 'Grupo sanguíneo es obligatorio'
        break

      case 4: // Declaración Jurada
        if (!formData.declaracion_jurada.acepta_terminos) {
          newErrors['acepta_terminos'] = 'Debe aceptar los términos'
        }
        if (!formData.declaracion_jurada.nombre_firmante.trim()) {
          newErrors['nombre_firmante'] = 'Nombre del firmante es obligatorio'
        }
        if (!formData.declaracion_jurada.firma_digital) {
          newErrors['firma_digital'] = 'Firma digital es obligatoria'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const getProgress = useCallback((): number => {
    let completedFields = 0
    let totalFields = 0

    // Contar campos completados en cada sección
    const sections = [
      // Sección 1: Datos del Estudiante (12 campos obligatorios)
      () => {
        const fields = [
          formData.apellido_paterno,
          formData.apellido_materno,
          formData.nombres,
          formData.sexo,
          formData.fecha_nacimiento,
          formData.nacionalidad,
          formData.nacionalidad === 'Peruana' ? formData.dni : formData.carne_extranjeria,
          formData.grado,
          formData.seccion,
          formData.domicilio_actual,
          formData.distrito
        ]
        return fields.filter(f => f && f.toString().trim()).length
      },

      // Sección 2: Composición Familiar (12 campos obligatorios)
      () => {
        const { padre, madre } = formData.composicion_familiar
        const fields = [
          padre.apellido_paterno,
          padre.apellido_materno,
          padre.nombres,
          padre.edad,
          padre.ocupacion,
          padre.celular,
          madre.apellido_paterno,
          madre.apellido_materno,
          madre.nombres,
          madre.edad,
          madre.ocupacion,
          madre.celular
        ]
        return fields.filter(f => f && f.toString().trim()).length
      },

      // Sección 3: Situación Económica (se considera completa si hay al menos un ingreso)
      () => {
        const hasIncome = formData.datos_economicos.ingresos.trabajador > 0 ||
                         formData.datos_economicos.ingresos.conyuge > 0 ||
                         formData.datos_economicos.ingresos.otros > 0
        return hasIncome ? 3 : 0
      },

      // Sección 4: Vivienda y Salud (3 campos obligatorios)
      () => {
        const fields = [
          formData.datos_vivienda.tipo_vivienda,
          formData.datos_salud.tipo_seguro,
          formData.datos_salud.grupo_sanguineo
        ]
        return fields.filter(f => f && f.toString().trim()).length
      },

      // Sección 5: Declaración Jurada (3 campos obligatorios)
      () => {
        const fields = [
          formData.declaracion_jurada.acepta_terminos,
          formData.declaracion_jurada.nombre_firmante,
          formData.declaracion_jurada.firma_digital
        ]
        return fields.filter(f => f && f.toString().trim()).length
      }
    ]

    sections.forEach(countFn => {
      completedFields += countFn()
    })

    // Total de campos obligatorios: 11 + 12 + 3 + 3 + 3 = 32
    totalFields = 32

    return Math.round((completedFields / totalFields) * 100)
  }, [formData])

  const canProceed = useCallback((): boolean => {
    return getProgress() === 100
  }, [getProgress])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    setCurrentStep(0)
  }, [])

  const value = useMemo(() => ({
    formData,
    errors,
    currentStep,
    updateFormData,
    updateNestedField,
    setCurrentStep,
    validateStep,
    getProgress,
    canProceed,
    resetForm
  }), [formData, errors, currentStep, updateFormData, updateNestedField, validateStep, getProgress, canProceed, resetForm])

  return (
    <FichaSocialFormContext.Provider value={value}>
      {children}
    </FichaSocialFormContext.Provider>
  )
}

export function useFichaSocialForm() {
  const context = useContext(FichaSocialFormContext)
  if (context === undefined) {
    throw new Error('useFichaSocialForm must be used within a FichaSocialFormProvider')
  }
  return context
}
