// components/EntrevistasTable.tsx
// Single Responsibility: Tabla de entrevistas

import Link from 'next/link'
import type { EntrevistaAplicada } from '@/types'

interface EntrevistasTableProps {
  entrevistas: EntrevistaAplicada[]
  onDelete: (id: string) => void
}

export default function EntrevistasTable({
  entrevistas,
  onDelete,
}: EntrevistasTableProps) {
  const getEstadoBadge = (estado: string) => {
    return estado === 'completa'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  if (entrevistas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No se encontraron entrevistas</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grado/Aula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entrevistas.map((entrevista) => (
              <tr key={entrevista.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entrevista.estudiante_apellidos},{' '}
                    {entrevista.estudiante_nombres}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {entrevista.estudiante_edad} años
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {entrevista.grado} - {entrevista.aula}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(
                      entrevista.estado
                    )}`}
                  >
                    {entrevista.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-2">
                      {entrevista.porcentaje_completado}%
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${entrevista.porcentaje_completado}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/entrevistas/${entrevista.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/entrevistas/${entrevista.id}/editar`}
                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      if (
                        confirm('¿Estás seguro de eliminar esta entrevista?')
                      ) {
                        onDelete(entrevista.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
