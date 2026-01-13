'use client'

// app/registros/cronica-caso-social/page.tsx
// Página de listado de Crónicas de Caso Social

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { CronicaCasoSocialService } from '@/services/CronicaCasoSocialService'
import type { CronicaCasoSocial } from '@/services/CronicaCasoSocialService'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'

export default function CronicasCasoSocialesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [cronicas, setCronicas] = useState<CronicaCasoSocial[]>([])
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
      loadCronicas()
    }
  }, [user])

  const loadCronicas = async () => {
    try {
      setLoading(true)
      setError('')

      const filtros: any = {}
      if (searchTerm) filtros.search = searchTerm

      const response = await CronicaCasoSocialService.getCronicasCasosSociales(filtros)
      setCronicas(response?.data || [])
    } catch (err: any) {
      setError(err.message || 'Error al cargar las crónicas de caso social')
      setCronicas([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta crónica de caso social?')) {
      return
    }

    try {
      await CronicaCasoSocialService.deleteCronicaCasoSocial(id)
      setSuccess('Crónica de caso social eliminada exitosamente')
      loadCronicas()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la crónica de caso social')
    }
  }

  const handlePrintPDF = async (cronica: CronicaCasoSocial) => {
    try {
      const content = generatePDFContent(cronica)

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Crónica de Caso Social - ${cronica.nombres_apellidos || 'N/A'}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                font-size: 11pt;
                line-height: 1.3;
                color: #000;
                background: #fff;
                margin: 15mm 20mm;
                padding: 0;
              }

              .top-border {
                border-top: 2px solid #000;
                margin-bottom: 20px;
              }

              .header {
                text-align: center;
                margin-bottom: 25px;
              }

              .header h1 {
                font-size: 16pt;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin: 0 0 8px 0;
                color: #000;
              }

              .header p {
                font-size: 9pt;
                font-style: italic;
                color: #000;
                margin: 0;
              }

              .section {
                margin-bottom: 20px;
              }

              .section h3 {
                font-size: 11pt;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 12px;
                padding-bottom: 4px;
                border-bottom: 1px solid #000;
                color: #000;
              }

              .data-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px 20px;
                margin-bottom: 10px;
              }

              .data-grid.full-width {
                grid-template-columns: 1fr;
              }

              .field {
                display: flex;
                gap: 4px;
              }

              .field-label {
                font-weight: bold;
                font-size: 10pt;
                color: #000;
                white-space: nowrap;
                min-width: 90px;
              }

              .field-value {
                font-size: 10pt;
                color: #000;
                flex: 1;
              }

              .relato-box {
                border: 1px solid #000;
                padding: 12px;
                min-height: 120px;
                page-break-inside: avoid;
              }

              .relato-content {
                text-align: justify;
                font-size: 10pt;
                line-height: 1.5;
                white-space: pre-wrap;
                color: #000;
              }

              .footer {
                margin-top: 40px;
                padding-top: 15px;
                border-top: 1px solid #000;
                border-bottom: 1px solid #000;
                text-align: center;
                page-break-inside: avoid;
              }

              .footer p {
                font-size: 8pt;
                font-style: italic;
                color: #000;
                margin: 0;
              }

              @media print {
                body {
                  margin: 10mm 15mm;
                }
                .section,
                .relato-box {
                  page-break-inside: avoid;
                }
                @page {
                  margin: 15mm;
                }
              }
            </style>
          </head>
          <body>
            <div class="top-border"></div>
            ${content}
            <div class="footer">
              <p>Documento confidencial de Trabajo Social. Su reproducción no autorizada está prohibida.</p>
            </div>
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

  const generatePDFContent = (cronica: CronicaCasoSocial): string => {
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
      return new Date(dateStr).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return `
      <div class="header">
        <h1>CRÓNICA DE CASO SOCIAL</h1>
        <p>Fecha de emisión: ${formatDate(cronica.created_at)}</p>
      </div>

      <div class="section">
        <h3>I. DATOS GENERALES</h3>
        <div class="data-grid">
          <div class="field">
            <span class="field-label">Nº Reunión:</span>
            <span class="field-value">${cronica.num_reunion || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Fecha y hora:</span>
            <span class="field-value">${formatDateTime(cronica.fecha_hora || '')}</span>
          </div>
          <div class="field full-width">
            <span class="field-label">Nombres:</span>
            <span class="field-value">${cronica.nombres_apellidos || 'N/A'}</span>
          </div>
          <div class="field full-width">
            <span class="field-label">Asistentes:</span>
            <span class="field-value">${cronica.asistentes || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>II. ACTIVIDADES REALIZADAS</h3>
        <div class="relato-box">
          <div class="relato-content">${cronica.actividades_realizadas || 'Sin información'}</div>
        </div>
      </div>

      <div class="section">
        <h3>III. PROGRAMAS A REALIZARSE</h3>
        <div class="relato-box">
          <div class="relato-content">${cronica.programas || 'Sin información'}</div>
        </div>
      </div>

      <div class="section">
        <h3>IV. RELATO</h3>
        <div class="relato-box">
          <div class="relato-content">${cronica.relato || 'Sin información'}</div>
        </div>
      </div>

      <div class="section">
        <h3>V. INTERPRETACIÓN</h3>
        <div class="relato-box">
          <div class="relato-content">${cronica.interpretacion || 'Sin información'}</div>
        </div>
      </div>

      <div class="section">
        <h3>VI. SUGERENCIAS</h3>
        <div class="relato-box">
          <div class="relato-content">${cronica.sugerencias || 'Sin información'}</div>
        </div>
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
              Crónicas de Caso Social
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión de crónicas de caso social
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/registros/cronica-caso-social/nuevo')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            + Nueva Crónica
          </button>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <SuccessAlert message={success} onClose={() => setSuccess('')} />
          </div>
        )}

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
                onKeyDown={(e) => e.key === 'Enter' && loadCronicas()}
                placeholder="Nombre, asistentes..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadCronicas}
                className="w-full px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nº Reunión
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nombres
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
                    {cronicas.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No se encontraron crónicas de caso social
                        </td>
                      </tr>
                    ) : (
                      cronicas.map((cronica) => (
                        <tr key={cronica.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {cronica.num_reunion || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {cronica.nombres_apellidos || 'Sin nombre'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {cronica.fecha_hora ? new Date(cronica.fecha_hora).toLocaleDateString('es-ES') : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/cronica-caso-social/${cronica.id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Ver
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/cronica-caso-social/${cronica.id}/editar`)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintPDF(cronica)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                            >
                              PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(cronica.id)}
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

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Total: {cronicas.length} crónica{cronicas.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
