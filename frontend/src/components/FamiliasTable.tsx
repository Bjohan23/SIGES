// components/FamiliasTable.tsx
// Single Responsibility: Tabla de familias disfuncionales

'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface FamiliasTableProps {
  familias: any[]
  onDelete: (id: string) => void
}

export default function FamiliasTable({
  familias,
  onDelete,
}: FamiliasTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    familia: any | null
  }>({ isOpen: false, familia: null })

  const handleDeleteClick = (familia: any) => {
    setDeleteDialog({
      isOpen: true,
      familia
    });
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.familia) {
      onDelete(deleteDialog.familia.id);
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, familia: null });
  }

  if (familias.length === 0) {
    return (
      <Fragment>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center border border-transparent dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron familias disfuncionales</p>
        </div>
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar familia?"
          message={`¿Estás seguro de que quieres eliminar a la familia de ${deleteDialog.familia?.apellidos_familia}, ${deleteDialog.familia?.nombres_familia}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-hidden border border-transparent dark:border-gray-700">
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
                    type="button"
                    onClick={() => handleDeleteClick(familia)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar familia?"
        message={`¿Estás seguro de que quieres eliminar a la familia de ${deleteDialog.familia?.apellidos_familia}, ${deleteDialog.familia?.nombres_familia}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </Fragment>
  )
}
