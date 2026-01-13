'use client'

// app/registros/registro-entrevista/page.tsx
// Página de listado de Registros de Entrevista

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { RegistroEntrevistaService } from '@/services/RegistroEntrevistaService'
import type { RegistroEntrevista } from '@/services/RegistroEntrevistaService'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'

export default function RegistrosEntrevistaPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [registros, setRegistros] = useState<RegistroEntrevista[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadRegistros()
    }
  }, [user])

  const loadRegistros = async () => {
    try {
      setLoading(true)
      setError('')

      const filtros: any = {}
      if (searchTerm) filtros.search = searchTerm

      const response = await RegistroEntrevistaService.getRegistrosEntrevistas(filtros)
      setRegistros(response?.data || [])
    } catch (err: any) {
      setError(err.message || 'Error al cargar los registros de entrevista')
      setRegistros([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este registro de entrevista?')) {
      return
    }

    try {
      await RegistroEntrevistaService.deleteRegistroEntrevista(id)
      setSuccess('Registro de entrevista eliminado exitosamente')
      loadRegistros()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el registro de entrevista')
    }
  }

  const handlePrintPDF = async (registro: RegistroEntrevista) => {
    try {
      const content = generatePDFContent(registro)

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Registro de Entrevista - ${registro.tema || 'N/A'}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #000;
                margin: 20px;
                padding: 0;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .header h1 {
                font-size: 18px;
                margin: 0;
                color: #333;
              }
              .header p {
                font-size: 14px;
                margin: 5px 0 0 0;
                color: #666;
              }
              .section {
                margin-bottom: 25px;
              }
              .section h3 {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
              }
              .section-content {
                margin-bottom: 10px;
              }
              .field {
                margin-bottom: 8px;
              }
              .field-label {
                font-weight: bold;
                color: #555;
              }
              .field-value {
                color: #000;
              }
              .text-content {
                white-space: pre-wrap;
                background: #f9f9f9;
                padding: 10px;
                border-left: 3px solid #ddd;
                margin: 10px 0;
              }
              .signature-section {
                margin-top: 60px;
                page-break-inside: avoid;
              }
              .signature-line {
                margin-top: 80px;
                border-top: 1px solid #000;
                width: 300px;
                text-align: center;
                padding-top: 10px;
                font-size: 11px;
                color: #666;
              }
              .signature-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-top: 60px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ccc;
                font-size: 10px;
                color: #999;
                text-align: center;
              }
              @media print {
                body { margin: 10mm; }
                .signature-section { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 500)
      }
    } catch (err) {
      console.error('Error al generar PDF:', err)
      setError('Error al generar el PDF')
    }
  }

  const generatePDFContent = (registro: RegistroEntrevista): string => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'N/A'
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return `
      <div class="header">
        <h1>REGISTRO DE ENTREVISTA</h1>
        <p>Fecha de emisión: ${formatDate(registro.created_at)}</p>
      </div>

      <div class="section">
        <h3>DATOS DE LA ENTREVISTA</h3>
        <div class="section-content">
          <div class="field">
            <span class="field-label">Lugar:</span>
            <span class="field-value">${registro.lugar || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Fecha:</span>
            <span class="field-value">${registro.fecha ? formatDateTime(registro.fecha) : 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Hora:</span>
            <span class="field-value">${registro.hora || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Tema:</span>
            <span class="field-value">${registro.tema || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Objetivo:</span>
            <span class="field-value">${registro.objetivo || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Entrevistado:</span>
            <span class="field-value">${registro.entrevistado || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Entrevistador:</span>
            <span class="field-value">${registro.entrevistador || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>DESCRIPCIÓN Y RELATO</h3>
        <div class="text-content">${registro.descripcion_relato || 'Sin información'}</div>
      </div>

      <div class="signature-section">
        <div class="signature-grid">
          <div>
            <div class="signature-line">Entrevistador</div>
          </div>
          <div>
            <div class="signature-line">Entrevistado</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Documento generado el ${new Date().toLocaleDateString('es-ES')}</p>
      </div>
    `
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              type="button"
              onClick={() => router.push('/registros')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-2"
            >
              ← Volver a Registros
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Registros de Entrevista
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión de registros de entrevista con guía adjunta
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/registros/registro-entrevista/nuevo')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            + Nuevo Registro
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6">
            <SuccessAlert message={success} onClose={() => setSuccess('')} />
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadRegistros()}
                placeholder="Tema, entrevistado..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadRegistros}
                className="w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <>
            {/* Tabla */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tema
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Entrevistado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {registros.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No se encontraron registros de entrevista
                        </td>
                      </tr>
                    ) : (
                      registros.map((registro) => (
                        <tr key={registro.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {registro.tema || 'Sin tema'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {registro.entrevistado || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-ES') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/registro-entrevista/${registro.id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Ver
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/registro-entrevista/${registro.id}/editar`)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintPDF(registro)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                            >
                              PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(registro.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contador */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Total: {registros.length} registro{registros.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
