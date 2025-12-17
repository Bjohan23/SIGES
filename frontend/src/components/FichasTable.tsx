// components/FichasTable.tsx
// Single Responsibility: Tabla de fichas sociales

'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import type { FichaSocial } from '@/types'
import { fichaSocialAlerts } from '@/components/FichaSocialAlert'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface FichasTableProps {
  fichas: FichaSocial[]
  onDelete: (id: string) => void
}

export default function FichasTable({ fichas, onDelete }: FichasTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    ficha: FichaSocial | null
  }>({ isOpen: false, ficha: null })

  const getEstadoBadge = (estado: string) => {
    const badges = {
      completa: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      incompleta: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      disfuncional: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    }
    return badges[estado as keyof typeof badges] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }

  const handleDeleteClick = (ficha: FichaSocial) => {
    // Show warning alert with ficha details
    fichaSocialAlerts.warning(
      ficha,
      "¿Confirmar eliminación?",
      `¿Está seguro de eliminar esta ficha social? Esta acción no se puede deshacer.`
    );

    // Open modern confirmation dialog
    setTimeout(() => {
      setDeleteDialog({
        isOpen: true,
        ficha
      });
    }, 1000);
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.ficha) {
      onDelete(deleteDialog.ficha.id);
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, ficha: null });
  }

  if (fichas.length === 0) {
    return (
      <Fragment>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center border border-transparent dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron fichas sociales</p>
        </div>
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar ficha social?"
          message={`¿Estás seguro de que quieres eliminar la ficha de ${deleteDialog.ficha?.nombres} ${deleteDialog.ficha?.apellidos}? Esta acción no se puede deshacer.`}
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
                Apellidos y Nombres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                DNI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Distrito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {fichas.map((ficha) => (
              <tr key={ficha.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {ficha.apellidos}, {ficha.nombres}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ficha.dni || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ficha.distrito || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(
                      ficha.estado
                    )}`}
                  >
                    {ficha.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                      {ficha.porcentaje_completado}%
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${ficha.porcentaje_completado}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <Link
                      href={`/fichas-sociales/${ficha.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                      title="Ver detalles"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/fichas-sociales/${ficha.id}/pdf`}
                      target="_blank"
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
                      title="Descargar PDF"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/fichas-sociales/${ficha.id}/editar`}
                      className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(ficha)}
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
        title="¿Eliminar ficha social?"
        message={`¿Estás seguro de que quieres eliminar la ficha de ${deleteDialog.ficha?.nombres} ${deleteDialog.ficha?.apellidos}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </Fragment>
  )
}
