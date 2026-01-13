'use client'

// app/registros/informe-social/page.tsx
// Página de listado de Informes Sociales

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { InformeSocialService } from '@/services/InformeSocialService'
import type { InformeSocial } from '@/services/InformeSocialService'
import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'

export default function InformesSocialesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [informes, setInformes] = useState<InformeSocial[]>([])
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
      loadInformes()
    }
  }, [user])

  const loadInformes = async () => {
    try {
      setLoading(true)
      setError('')

      const filtros: any = {}
      if (searchTerm) filtros.search = searchTerm

      const response = await InformeSocialService.getInformesSociales(filtros)
      setInformes(response.data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los informes sociales')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este informe social?')) {
      return
    }

    try {
      await InformeSocialService.deleteInformeSocial(id)
      setSuccess('Informe social eliminado exitosamente')
      loadInformes()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el informe social')
    }
  }

  const handlePrintPDF = async (informe: InformeSocial) => {
    try {
      // Generar contenido HTML para el PDF
      const content = generatePDFContent(informe)

      // Crear una nueva ventana para imprimir
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Informe Social - ${informe.nombres_apellidos || 'N/A'}</title>
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
        // Esperar a que el contenido se cargue antes de imprimir
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

  const generatePDFContent = (informe: InformeSocial): string => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'N/A'
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return `
      <div class="header">
        <h1>INFORME SOCIAL</h1>
        <p>Fecha de emisión: ${formatDate(informe.created_at)}</p>
      </div>

      <div class="section">
        <h3>I. DATOS GENERALES</h3>
        <div class="section-content">
          <div class="field">
            <span class="field-label">Nombres y Apellidos:</span>
            <span class="field-value">${informe.nombres_apellidos || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Edad:</span>
            <span class="field-value">${informe.edad ? informe.edad + ' años' : 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Estado Civil:</span>
            <span class="field-value">${informe.estado_civil || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Grado de Instrucción:</span>
            <span class="field-value">${informe.grado_instruccion || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Dirección:</span>
            <span class="field-value">${informe.direccion || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Motivo:</span>
            <span class="field-value">${informe.motivo || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>II. SITUACIÓN FAMILIAR</h3>
        <div class="text-content">${informe.situacion_familiar || 'Sin información'}</div>
      </div>

      <div class="section">
        <h3>III. SITUACIÓN ECONÓMICA</h3>
        <div class="text-content">${informe.situacion_economica || 'Sin información'}</div>
      </div>

      <div class="section">
        <h3>IV. VIVIENDA</h3>
        <div class="text-content">${informe.vivienda || 'Sin información'}</div>
      </div>

      <div class="section">
        <h3>V. EDUCACIÓN</h3>
        <div class="text-content">${informe.educacion || 'Sin información'}</div>
      </div>

      <div class="section">
        <h3>VI. PROBLEMA SOCIAL</h3>
        <div class="text-content">${informe.problema_social || 'Sin información'}</div>
      </div>

      <div class="section">
        <h3>VII. APRECIACIÓN PROFESIONAL</h3>
        <div class="section-content">
          <div class="field">
            <span class="field-label">Apreciación:</span>
          </div>
          <div class="text-content">${informe.apreciacion_profesional || 'N/A'}</div>
          <div class="field">
            <span class="field-label">Lugar:</span>
            <span class="field-value">${informe.lugar || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="field-label">Fecha:</span>
            <span class="field-value">${informe.fecha ? formatDate(informe.fecha) : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-grid">
          <div>
            <div class="signature-line">Trabajador(a) Social</div>
          </div>
          <div>
            <div class="signature-line">Firma del Beneficiario(a)</div>
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
              Informes Sociales
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestión de informes sociales de padres/tutores/apoderados
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/registros/informe-social/nuevo')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            + Nuevo Informe
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
                onKeyDown={(e) => e.key === 'Enter' && loadInformes()}
                placeholder="Nombre, apellido, motivo..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadInformes}
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
                        Nombres y Apellidos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Motivo
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
                    {informes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No se encontraron informes sociales
                        </td>
                      </tr>
                    ) : (
                      informes.map((informe) => (
                        <tr key={informe.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {informe.nombres_apellidos || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                              {informe.motivo || 'Sin motivo'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(informe.created_at).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/informe-social/${informe.id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Ver
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push(`/registros/informe-social/${informe.id}/editar`)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 mr-3"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintPDF(informe)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                            >
                              PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(informe.id)}
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
              Total: {informes.length} informe{informes.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
