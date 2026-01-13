// components/EstudiantesTable.tsx
// Single Responsibility: Tabla de estudiantes

'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import type { Estudiante } from '@/types'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface EstudiantesTableProps {
  estudiantes: Estudiante[]
  onDelete: (id: string) => void
}

export default function EstudiantesTable({ estudiantes, onDelete }: EstudiantesTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    estudiante: Estudiante | null
  }>({ isOpen: false, estudiante: null })

  const getActivoBadge = (activo: boolean) => {
    return activo
      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }

  const handleDeleteClick = (estudiante: Estudiante) => {
    setDeleteDialog({
      isOpen: true,
      estudiante
    });
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.estudiante) {
      onDelete(deleteDialog.estudiante.id);
      setDeleteDialog({ isOpen: false, estudiante: null });
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, estudiante: null });
  }

  if (estudiantes.length === 0) {
    return (
      <Fragment>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center border border-transparent dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron estudiantes</p>
        </div>
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar estudiante?"
          message={`¿Estás seguro de que quieres eliminar al estudiante ${deleteDialog.estudiante?.nombres} ${deleteDialog.estudiante?.apellido_paterno} ${deleteDialog.estudiante?.apellido_materno}? Esta acción no se puede deshacer.`}
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
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Apellido Paterno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Apellido Materno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nombres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                DNI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {estudiantes.map((estudiante) => (
              <tr key={estudiante.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {estudiante.codigo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {estudiante.apellido_paterno}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {estudiante.apellido_materno}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {estudiante.nombres}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {estudiante.dni || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActivoBadge(
                      estudiante.activo
                    )}`}
                  >
                    {estudiante.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <Link
                      href={`/estudiantes/${estudiante.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                      title="Ver detalles"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/estudiantes/${estudiante.id}/editar`}
                      className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(estudiante)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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
        title="¿Eliminar estudiante?"
        message={`¿Estás seguro de que quieres eliminar al estudiante ${deleteDialog.estudiante?.nombres} ${deleteDialog.estudiante?.apellido_paterno} ${deleteDialog.estudiante?.apellido_materno}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </Fragment>
  )
}
