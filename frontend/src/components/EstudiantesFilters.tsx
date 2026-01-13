// components/EstudiantesFilters.tsx
// Single Responsibility: Filtros para estudiantes

import { useState, FormEvent } from 'react'

interface EstudiantesFiltersProps {
  onFilter: (filtros: {
    codigo?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    dni?: string
    activo?: boolean
  }) => void
}

export default function EstudiantesFilters({ onFilter }: EstudiantesFiltersProps) {
  const [codigo, setCodigo] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [dni, setDni] = useState('')
  const [activo, setActivo] = useState<string>('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onFilter({
      codigo: codigo || undefined,
      nombres: nombres || undefined,
      apellido_paterno: apellidoPaterno || undefined,
      apellido_materno: apellidoMaterno || undefined,
      dni: dni || undefined,
      activo: activo === '' ? undefined : activo === 'true',
    })
  }

  const handleReset = () => {
    setCodigo('')
    setNombres('')
    setApellidoPaterno('')
    setApellidoMaterno('')
    setDni('')
    setActivo('')
    onFilter({})
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="codigo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Código
          </label>
          <input
            type="text"
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Buscar por código..."
          />
        </div>

        <div>
          <label
            htmlFor="apellidoPaterno"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Apellido Paterno
          </label>
          <input
            type="text"
            id="apellidoPaterno"
            value={apellidoPaterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Buscar por apellido paterno..."
          />
        </div>

        <div>
          <label
            htmlFor="apellidoMaterno"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Apellido Materno
          </label>
          <input
            type="text"
            id="apellidoMaterno"
            value={apellidoMaterno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Buscar por apellido materno..."
          />
        </div>

        <div>
          <label
            htmlFor="dni"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            DNI
          </label>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Buscar por DNI..."
          />
        </div>

        <div>
          <label
            htmlFor="nombres"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nombres
          </label>
          <input
            type="text"
            id="nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Buscar por nombres..."
          />
        </div>

        <div>
          <label
            htmlFor="activo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Estado
          </label>
          <select
            id="activo"
            value={activo}
            onChange={(e) => setActivo(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
          >
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div className="flex items-end gap-2 col-span-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}
