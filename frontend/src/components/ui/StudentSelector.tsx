'use client'

// components/ui/StudentSelector.tsx
// Componente para buscar y seleccionar estudiantes con opción de crear nuevo

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EstudianteService } from '@/services/EstudianteService'
import { calculateAge } from '@/utils/date'
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
  const [hasSearched, setHasSearched] = useState(false)

  // Buscar estudiantes cuando cambia el query
  useEffect(() => {
    const searchStudents = async () => {
      if (query.length < 2) {
        setResults([])
        setHasSearched(false)
        return
      }

      try {
        setLoading(true)
        setHasSearched(true)

        // Usar el método search del servicio que busca con lógica OR
        const estudiantes = await EstudianteService.searchEstudiantes(query)
        setResults(estudiantes)
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
    const fullName = `${estudiante.nombres} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`
    setQuery(fullName)
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

  const handleCreateNew = () => {
    // Guardar el query en sessionStorage para pre-llenar el formulario
    if (query.length >= 2) {
      sessionStorage.setItem('studentSelector_query', query)
    }
    router.push('/estudiantes/nuevo')
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        {/* Input de búsqueda */}
        <div className="relative">
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
            className={`w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white pr-20 transition-colors ${
              error
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />

          {/* Icono de búsqueda */}
          {!selectedStudent && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}

          {/* Botón de limpiar */}
          {selectedStudent && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              title="Limpiar selección"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Indicador de carga */}
          {loading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown con resultados */}
      {showDropdown && !selectedStudent && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Buscando estudiantes...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {results.length} {results.length === 1 ? 'estudiante encontrado' : 'estudiantes encontrados'}
                </p>
              </div>
              {results.map((estudiante) => {
                const age = calculateAge(estudiante.fecha_nacimiento)
                return (
                  <button
                    key={estudiante.id}
                    type="button"
                    onClick={() => handleSelectStudent(estudiante)}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                          {estudiante.nombres} {estudiante.apellido_paterno} {estudiante.apellido_materno}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0v1m-4 0v6m8-6v6" />
                            </svg>
                            {estudiante.codigo}
                          </span>
                          {estudiante.dni && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              {estudiante.dni}
                            </span>
                          )}
                          {age && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {age} años
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : hasSearched ? (
            <div className="px-4 py-6 text-center">
              {/* Icono de sin resultados */}
              <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                No se encontraron estudiantes
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                "{query}" no coincide con ningún estudiante registrado
              </p>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar Nuevo Estudiante
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {/* Información del estudiante seleccionado */}
      {selectedStudent && (
        <div className="mt-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                  Estudiante Seleccionado
                </p>
              </div>
              <p className="font-medium text-indigo-900 dark:text-indigo-100">
                {selectedStudent.nombres} {selectedStudent.apellido_paterno} {selectedStudent.apellido_materno}
              </p>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 mt-2 flex flex-wrap gap-3">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0v1m-4 0v6m8-6v6" />
                  </svg>
                  {selectedStudent.codigo}
                </span>
                {selectedStudent.dni && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {selectedStudent.dni}
                  </span>
                )}
                {selectedStudent.fecha_nacimiento && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {calculateAge(selectedStudent.fecha_nacimiento)} años
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                type="button"
                onClick={() => router.push(`/estudiantes/${selectedStudent.id}`)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
