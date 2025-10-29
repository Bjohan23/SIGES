// components/FamiliasTable.tsx
// Single Responsibility: Tabla de familias disfuncionales

import Link from 'next/link'

interface FamiliasTableProps {
  familias: any[]
  onDelete: (id: string) => void
}

export default function FamiliasTable({
  familias,
  onDelete,
}: FamiliasTableProps) {
  if (familias.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No se encontraron familias disfuncionales</p>
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
                Familia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distrito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Evaluación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seguimiento
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {familias.map((familia) => (
              <tr key={familia.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {familia.apellidos_familia}, {familia.nombres_familia}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {familia.distrito || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(familia.fecha_evaluacion).toLocaleDateString(
                      'es-ES'
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      familia.seguimiento_activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {familia.seguimiento_activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/familias-disfuncionales/${familia.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/familias-disfuncionales/${familia.id}/editar`}
                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          '¿Estás seguro de eliminar este registro?'
                        )
                      ) {
                        onDelete(familia.id)
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
