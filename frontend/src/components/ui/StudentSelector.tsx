'use client'

// components/ui/StudentSelector.tsx
// Componente para buscar y seleccionar estudiantes con opción de crear nuevo

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EstudianteService } from '@/services/EstudianteService'
import type { Estudiante } from '@/types'

interface StudentSelectorProps {
  onStudentSelect: (estudiante: Estudiante) => void
  selectedStudent?: Estudiante | null
  label?: string
  placeholder?: string
  error?: string
}

export default function StudentSelector({
  onStudentSelect,
  selectedStudent,
  label = 'Buscar Estudiante',
  placeholder = 'Escribe nombres o apellidos...',
  error,
}: StudentSelectorProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Buscar estudiantes cuando cambia el query
  useEffect(() => {
    const searchStudents = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        const estudiantes = await EstudianteService.getEstudiantes({
          nombres: query,
          apellido_paterno: query,
          limit: 10,
        })
        setResults(estudiantes.data || [])
        setShowDropdown(true)
      } catch (err) {
        console.error('Error al buscar estudiantes:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchStudents, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelectStudent = (estudiante: Estudiante) => {
    setQuery(`${estudiante.nombres} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`)
    setResults([])
    setShowDropdown(false)
    onStudentSelect(estudiante)
  }

  const handleClearSelection = () => {
    setQuery('')
    setResults([])
    setShowDropdown(false)
    onStudentSelect(null as any)
  }

  const calculateAge = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return null
    const today = new Date()
    const birthDate = new Date(fechaNacimiento)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        {/* Input de búsqueda */}
        <input
          type="text"
          value={selectedStudent
            ? `${selectedStudent.nombres} ${selectedStudent.apellido_paterno} ${selectedStudent.apellido_materno}`
            : query
          }
          onChange={(e) => {
            setQuery(e.target.value)
            if (selectedStudent) {
              onStudentSelect(null as any)
            }
          }}
          onFocus={() => {
            if (!selectedStudent && query.length >= 2) {
              setShowDropdown(true)
            }
          }}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white pr-20 ${
            error
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />

        {/* Botón de limpiar */}
        {selectedStudent && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown con resultados */}
      {showDropdown && !selectedStudent && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            results.map((estudiante) => {
              const age = calculateAge(estudiante.fecha_nacimiento)
              return (
                <button
                  key={estudiante.id}
                  type="button"
                  onClick={() => handleSelectStudent(estudiante)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3 mt-1">
                    <span>DNI: {estudiante.dni || 'N/A'}</span>
                    {age && <span>Edad: {age} años</span>}
                    <span>Código: {estudiante.codigo}</span>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                No se encontró ningún estudiante
              </p>
              <button
                type="button"
                onClick={() => router.push('/estudiantes/nuevo')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar Nuevo Estudiante
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Información del estudiante seleccionado */}
      {selectedStudent && (
        <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-indigo-900 dark:text-indigo-100">
                {selectedStudent.nombres} {selectedStudent.apellido_paterno} {selectedStudent.apellido_materno}
              </p>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 mt-1 flex gap-3">
                <span>DNI: {selectedStudent.dni || 'N/A'}</span>
                <span>Código: {selectedStudent.codigo}</span>
                {selectedStudent.fecha_nacimiento && (
                  <span>Edad: {calculateAge(selectedStudent.fecha_nacimiento)} años</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/estudiantes/${selectedStudent.id}`)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
            >
              Ver perfil
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
