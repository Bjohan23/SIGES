// components/EntrevistasTable.tsx
// Single Responsibility: Tabla de entrevistas

'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import type { EntrevistaAplicada } from '@/types'
import { fichaSocialAlerts } from '@/components/FichaSocialAlert'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface EntrevistasTableProps {
  entrevistas: EntrevistaAplicada[]
  onDelete: (id: string) => void
}

export default function EntrevistasTable({
  entrevistas,
  onDelete,
}: EntrevistasTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    entrevista: EntrevistaAplicada | null
  }>({ isOpen: false, entrevista: null })

  const getEstadoBadge = (estado: string) => {
    return estado === 'completa'
      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  }

  const handleDeleteClick = (entrevista: EntrevistaAplicada) => {
    // Show warning alert with entrevista details
    fichaSocialAlerts.warning(
      {
        id: entrevista.id,
        nombres: entrevista.estudiante_nombres || '',
        apellidos: entrevista.estudiante_apellidos || '',
        dni: entrevista.estudiante_dni || '',
        distrito: '',
        estado: entrevista.estado || 'COMPLETADA',
        porcentaje_completado: entrevista.porcentaje_completado || 100,
        created_at: entrevista.created_at,
        updated_at: entrevista.updated_at,
        creador: null,
        actualizador: null,
        _count: { entrevistas: 0 }
      },
      "¿Confirmar eliminación?",
      `¿Está seguro de eliminar esta entrevista? Esta acción no se puede deshacer.`
    );

    // Open modern confirmation dialog
    setTimeout(() => {
      setDeleteDialog({
        isOpen: true,
        entrevista
      });
    }, 1000);
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.entrevista) {
      onDelete(deleteDialog.entrevista.id);
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, entrevista: null });
  }

  if (entrevistas.length === 0) {
    return (
      <Fragment>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center border border-transparent dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No se encontraron entrevistas</p>
        </div>
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar entrevista?"
          message={`¿Estás seguro de que quieres eliminar la entrevista de ${deleteDialog.entrevista?.estudiante_nombres} ${deleteDialog.entrevista?.estudiante_apellidos}? Esta acción no se puede deshacer.`}
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
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Edad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Grado/Aula
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
            {entrevistas.map((entrevista) => (
              <tr key={entrevista.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {entrevista.estudiante_apellidos},{' '}
                    {entrevista.estudiante_nombres}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {entrevista.estudiante_edad} años
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
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
                    <div className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                      {entrevista.porcentaje_completado}%
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full"
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
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/entrevistas/${entrevista.id}/editar`}
                    className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(entrevista)}
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
        title="¿Eliminar entrevista?"
        message={`¿Estás seguro de que quieres eliminar la entrevista de ${deleteDialog.entrevista?.estudiante_nombres} ${deleteDialog.entrevista?.estudiante_apellidos}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </Fragment>
  )
}
