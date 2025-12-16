// components/FichasFilters.tsx
// Single Responsibility: Filtros para fichas sociales

import { useState, FormEvent } from 'react'

interface FichasFiltersProps {
  onFilter: (filtros: {
    apellidos?: string
    estado?: string
    distrito?: string
  }) => void
}

export default function FichasFilters({ onFilter }: FichasFiltersProps) {
  const [apellidos, setApellidos] = useState('')
  const [estado, setEstado] = useState('')
  const [distrito, setDistrito] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onFilter({
      apellidos: apellidos || undefined,
      estado: estado || undefined,
      distrito: distrito || undefined,
    })
  }

  const handleReset = () => {
    setApellidos('')
    setEstado('')
    setDistrito('')
    onFilter({})
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 mb-6 border border-transparent dark:border-gray-700">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="apellidos"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Apellidos
          </label>
          <input
            type="text"
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Buscar por apellidos..."
          />
        </div>

        <div>
          <label
            htmlFor="estado"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Estado
          </label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
          >
            <option value="">Todos</option>
            <option value="completa">Completa</option>
            <option value="incompleta">Incompleta</option>
            <option value="disfuncional">Disfuncional</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="distrito"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Distrito
          </label>
          <input
            type="text"
            id="distrito"
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Buscar por distrito..."
          />
        </div>

        <div className="flex items-end gap-2">
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
