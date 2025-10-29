'use client'

// app/fichas-sociales/[id]/pdf/page.tsx
// Página para generar y descargar PDF de Ficha Social

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FichaSocialService } from '@/services/FichaSocialService'
import type { FichaSocial } from '@/types'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function FichaSocialPDFPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fichaId = params?.id as string

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const generatePDF = async () => {
      if (!fichaId) return

      try {
        setLoading(true)
        const ficha = await FichaSocialService.getFichaById(fichaId)

        // Generar PDF
        const doc = new jsPDF('p', 'mm', 'a4')
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        let yPosition = 20

        // Helper para agregar nueva página si es necesario
        const checkAndAddPage = (requiredSpace: number = 20) => {
          if (yPosition + requiredSpace > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
        }

        // Helper para formatear moneda
        const formatCurrency = (value: number) => {
          return `S/ ${value.toFixed(2)}`
        }

        // Helper para formatear fecha
        const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }

        // ENCABEZADO
        doc.setFillColor(59, 130, 246) // bg-blue-600
        doc.rect(0, 0, pageWidth, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('FICHA SOCIAL', pageWidth / 2, 12, { align: 'center' })
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text('I.E. Nicolas La Torre Garcia', pageWidth / 2, 21, { align: 'center' })
        doc.setFontSize(9)
        doc.text('Chiclayo - Peru', pageWidth / 2, 28, { align: 'center' })
        doc.setFontSize(8)
        doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, pageWidth / 2, 35, { align: 'center' })

        yPosition = 50

        // DATOS DEL ESTUDIANTE
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('DATOS DEL ESTUDIANTE', 15, yPosition)
        yPosition += 7

        autoTable(doc, {
          startY: yPosition,
          head: [['Campo', 'Valor']],
          body: [
            ['Apellido Paterno', ficha.apellido_paterno || 'N/A'],
            ['Apellido Materno', ficha.apellido_materno || 'N/A'],
            ['Nombres', ficha.nombres],
            ['Sexo', ficha.sexo === 'M' ? 'Masculino' : 'Femenino'],
            ['Fecha de Nacimiento', formatDate(ficha.fecha_nacimiento)],
            ['Edad', ficha.edad?.toString() || 'N/A'],
            ['Nacionalidad', ficha.nacionalidad],
            [ficha.nacionalidad === 'Peruana' ? 'DNI' : 'Carné de Extranjería', ficha.dni || ficha.carne_extranjeria || 'N/A'],
            ['Grado', ficha.grado || 'N/A'],
            ['Sección', ficha.seccion || 'N/A'],
            ['Estado Civil', ficha.estado_civil || 'N/A'],
            ['Número de Hijos', ficha.num_hijos?.toString() || '0'],
            ['Domicilio Actual', ficha.domicilio_actual || 'N/A'],
            ['Distrito', ficha.distrito || 'N/A']
          ],
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 120 }
          },
          margin: { left: 15, right: 15 }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15

        // COMPOSICIÓN FAMILIAR
        if (ficha.composicion_familiar) {
          checkAndAddPage(80)

          doc.setFontSize(14)
          doc.setFont('helvetica', 'bold')
          doc.text('COMPOSICIÓN FAMILIAR', 15, yPosition)
          yPosition += 7

          // Datos del Padre
          doc.setFontSize(12)
          doc.setTextColor(30, 64, 175) // text-blue-900
          doc.text('Datos del Padre', 15, yPosition)
          yPosition += 5

          autoTable(doc, {
            startY: yPosition,
            head: [['Campo', 'Valor']],
            body: [
              ['Apellido Paterno', ficha.composicion_familiar.padre.apellido_paterno],
              ['Apellido Materno', ficha.composicion_familiar.padre.apellido_materno],
              ['Nombres', ficha.composicion_familiar.padre.nombres],
              ['Edad', ficha.composicion_familiar.padre.edad?.toString() || 'N/A'],
              ['Ocupación', ficha.composicion_familiar.padre.ocupacion],
              ['Centro Laboral', ficha.composicion_familiar.padre.centro_laboral || 'N/A'],
              ['Celular', ficha.composicion_familiar.padre.celular]
            ],
            theme: 'striped',
            headStyles: { fillColor: [219, 234, 254], textColor: 0 },
            columnStyles: {
              0: { cellWidth: 60, fontStyle: 'bold' },
              1: { cellWidth: 120 }
            },
            margin: { left: 15, right: 15 }
          })

          yPosition = (doc as any).lastAutoTable.finalY + 10

          // Datos de la Madre
          doc.setTextColor(131, 24, 67) // text-pink-900
          doc.text('Datos de la Madre', 15, yPosition)
          yPosition += 5

          autoTable(doc, {
            startY: yPosition,
            head: [['Campo', 'Valor']],
            body: [
              ['Apellido Paterno', ficha.composicion_familiar.madre.apellido_paterno],
              ['Apellido Materno', ficha.composicion_familiar.madre.apellido_materno],
              ['Nombres', ficha.composicion_familiar.madre.nombres],
              ['Edad', ficha.composicion_familiar.madre.edad?.toString() || 'N/A'],
              ['Ocupación', ficha.composicion_familiar.madre.ocupacion],
              ['Centro Laboral', ficha.composicion_familiar.madre.centro_laboral || 'N/A'],
              ['Celular', ficha.composicion_familiar.madre.celular]
            ],
            theme: 'striped',
            headStyles: { fillColor: [252, 231, 243], textColor: 0 },
            columnStyles: {
              0: { cellWidth: 60, fontStyle: 'bold' },
              1: { cellWidth: 120 }
            },
            margin: { left: 15, right: 15 }
          })

          yPosition = (doc as any).lastAutoTable.finalY + 15
        }

        // SITUACIÓN ECONÓMICA
        if (ficha.datos_economicos) {
          checkAndAddPage(100)

          doc.setTextColor(0, 0, 0)
          doc.setFontSize(14)
          doc.setFont('helvetica', 'bold')
          doc.text('SITUACIÓN ECONÓMICA', 15, yPosition)
          yPosition += 7

          // Ingresos
          doc.setFontSize(12)
          doc.setTextColor(20, 83, 45) // text-green-900
          doc.text('Ingresos Mensuales', 15, yPosition)
          yPosition += 5

          const totalIngresos = (ficha.datos_economicos.ingresos.trabajador || 0) +
                               (ficha.datos_economicos.ingresos.conyuge || 0) +
                               (ficha.datos_economicos.ingresos.otros || 0)

          autoTable(doc, {
            startY: yPosition,
            head: [['Concepto', 'Monto']],
            body: [
              ['Ingreso del Trabajador', formatCurrency(ficha.datos_economicos.ingresos.trabajador)],
              ['Ingreso del Cónyuge', formatCurrency(ficha.datos_economicos.ingresos.conyuge)],
              ['Otros Ingresos', formatCurrency(ficha.datos_economicos.ingresos.otros)],
              ['TOTAL INGRESOS', formatCurrency(totalIngresos)]
            ],
            theme: 'striped',
            headStyles: { fillColor: [34, 197, 94], textColor: 255 },
            columnStyles: {
              0: { cellWidth: 120, fontStyle: 'bold' },
              1: { cellWidth: 60, halign: 'right' }
            },
            bodyStyles: {
              3: { fillColor: [220, 252, 231], fontStyle: 'bold' }
            },
            margin: { left: 15, right: 15 }
          })

          yPosition = (doc as any).lastAutoTable.finalY + 10

          // Egresos
          checkAndAddPage(80)
          doc.setTextColor(127, 29, 29) // text-red-900
          doc.text('Egresos Mensuales', 15, yPosition)
          yPosition += 5

          const egresosData = []

          // Servicios Básicos
          egresosData.push(['SERVICIOS BÁSICOS', ''])
          egresosData.push(['  Agua', formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.agua)])
          egresosData.push(['  Luz', formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.luz)])
          egresosData.push(['  Teléfono', formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.telefono)])
          egresosData.push(['  Internet', formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.internet)])
          egresosData.push(['  Cable', formatCurrency(ficha.datos_economicos.egresos.servicios_basicos.cable)])

          // Gastos Familiares
          egresosData.push(['GASTOS FAMILIARES', ''])
          egresosData.push(['  Alimentación', formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.alimentacion)])
          egresosData.push(['  Educación', formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.educacion)])
          egresosData.push(['  Salud', formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.salud)])
          egresosData.push(['  Transporte', formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.transporte)])
          egresosData.push(['  Vestimenta', formatCurrency(ficha.datos_economicos.egresos.gastos_familiares.vestimenta)])

          // Deudas y Seguros
          egresosData.push(['DEUDAS Y SEGUROS', ''])
          egresosData.push(['  Préstamos', formatCurrency(ficha.datos_economicos.egresos.deudas_seguros.prestamos)])
          egresosData.push(['  Seguros', formatCurrency(ficha.datos_economicos.egresos.deudas_seguros.seguros)])

          const totalEgresos = Object.values(ficha.datos_economicos.egresos.servicios_basicos).reduce((sum, val) => sum + (val || 0), 0) +
                              Object.values(ficha.datos_economicos.egresos.gastos_familiares).reduce((sum, val) => sum + (val || 0), 0) +
                              Object.values(ficha.datos_economicos.egresos.deudas_seguros).reduce((sum, val) => sum + (val || 0), 0)

          egresosData.push(['TOTAL EGRESOS', formatCurrency(totalEgresos)])

          autoTable(doc, {
            startY: yPosition,
            head: [['Concepto', 'Monto']],
            body: egresosData,
            theme: 'striped',
            headStyles: { fillColor: [239, 68, 68], textColor: 255 },
            columnStyles: {
              0: { cellWidth: 120 },
              1: { cellWidth: 60, halign: 'right' }
            },
            bodyStyles: {
              0: { fillColor: [254, 226, 226], fontStyle: 'bold' },
              6: { fillColor: [254, 226, 226], fontStyle: 'bold' },
              12: { fillColor: [254, 226, 226], fontStyle: 'bold' },
              15: { fillColor: [254, 202, 202], fontStyle: 'bold' }
            },
            margin: { left: 15, right: 15 }
          })

          yPosition = (doc as any).lastAutoTable.finalY + 10

          // Balance
          const balance = totalIngresos - totalEgresos
          checkAndAddPage(30)

          autoTable(doc, {
            startY: yPosition,
            head: [['Concepto', 'Monto']],
            body: [
              ['Total Ingresos', formatCurrency(totalIngresos)],
              ['Total Egresos', formatCurrency(totalEgresos)],
              ['BALANCE FINAL', formatCurrency(balance)]
            ],
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            columnStyles: {
              0: { cellWidth: 120, fontStyle: 'bold' },
              1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
            },
            bodyStyles: {
              0: { fillColor: [220, 252, 231] },
              1: { fillColor: [254, 226, 226] },
              2: { fillColor: balance >= 0 ? [219, 234, 254] : [254, 215, 170] }
            },
            margin: { left: 15, right: 15 }
          })

          yPosition = (doc as any).lastAutoTable.finalY + 15
        }

        // VIVIENDA Y SALUD
        checkAndAddPage(60)
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('VIVIENDA Y SALUD', 15, yPosition)
        yPosition += 7

        const viviendaSaludData = []

        if (ficha.datos_vivienda) {
          viviendaSaludData.push(['Tipo de Vivienda', ficha.datos_vivienda.tipo_vivienda || 'N/A'])

          if (ficha.datos_vivienda.material?.length) {
            viviendaSaludData.push(['Material de Construcción', ficha.datos_vivienda.material.join(', ')])
          }

          if (ficha.datos_vivienda.tenencia?.length) {
            viviendaSaludData.push(['Tenencia', ficha.datos_vivienda.tenencia.join(', ')])
          }

          if (ficha.datos_vivienda.servicios?.length) {
            viviendaSaludData.push(['Servicios Básicos', ficha.datos_vivienda.servicios.join(', ')])
          }

          if (ficha.datos_vivienda.problemas_sociales?.length) {
            viviendaSaludData.push(['Problemas Sociales', ficha.datos_vivienda.problemas_sociales.join(', ')])
          }
        }

        if (ficha.datos_salud) {
          viviendaSaludData.push(['Tipo de Seguro', ficha.datos_salud.tipo_seguro || 'N/A'])
          viviendaSaludData.push(['Grupo Sanguíneo', ficha.datos_salud.grupo_sanguineo || 'N/A'])

          if (ficha.datos_salud.alergias?.tiene) {
            viviendaSaludData.push(['Alergias', ficha.datos_salud.alergias.especificar || 'Sí (sin especificar)'])
          }

          if (ficha.datos_salud.enfermedades?.tiene) {
            viviendaSaludData.push(['Enfermedades Crónicas', ficha.datos_salud.enfermedades.especificar || 'Sí (sin especificar)'])
          }

          if (ficha.datos_salud.discapacidad?.tiene) {
            viviendaSaludData.push([
              'Discapacidad',
              `${ficha.datos_salud.discapacidad.tipo || 'N/A'} - Grado: ${ficha.datos_salud.discapacidad.grado || 'N/A'}`
            ])
          }
        }

        if (viviendaSaludData.length > 0) {
          autoTable(doc, {
            startY: yPosition,
            head: [['Campo', 'Valor']],
            body: viviendaSaludData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            columnStyles: {
              0: { cellWidth: 60, fontStyle: 'bold' },
              1: { cellWidth: 120 }
            },
            margin: { left: 15, right: 15 }
          })

          yPosition = (doc as any).lastAutoTable.finalY + 15
        }

        // DECLARACIÓN JURADA
        if (ficha.declaracion_jurada) {
          checkAndAddPage(50)

          doc.setFontSize(14)
          doc.setFont('helvetica', 'bold')
          doc.text('DECLARACIÓN JURADA', 15, yPosition)
          yPosition += 7

          autoTable(doc, {
            startY: yPosition,
            head: [['Campo', 'Valor']],
            body: [
              ['Nombre del Firmante', ficha.declaracion_jurada.nombre_firmante],
              ['Términos Aceptados', ficha.declaracion_jurada.acepta_terminos ? 'Sí' : 'No'],
              ['Fecha de Firma', ficha.declaracion_jurada.fecha_firma ? formatDate(ficha.declaracion_jurada.fecha_firma) : 'N/A']
            ],
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            columnStyles: {
              0: { cellWidth: 60, fontStyle: 'bold' },
              1: { cellWidth: 120 }
            },
            margin: { left: 15, right: 15 }
          })

          yPosition = (doc as any).lastAutoTable.finalY + 10

          // Agregar firma digital si existe
          if (ficha.declaracion_jurada.firma_digital) {
            checkAndAddPage(40)
            doc.setFontSize(10)
            doc.text('Firma Digital:', 15, yPosition)
            yPosition += 5

            try {
              doc.addImage(
                ficha.declaracion_jurada.firma_digital,
                'PNG',
                15,
                yPosition,
                80,
                30
              )
            } catch (e) {
              console.error('Error al agregar firma:', e)
            }
          }
        }

        // PIE DE PÁGINA EN TODAS LAS PÁGINAS
        const totalPages = (doc as any).internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i)
          doc.setFontSize(8)
          doc.setTextColor(128, 128, 128)
          doc.text(
            `Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          )
          doc.text(
            'I.E. Nicolas La Torre Garcia - Chiclayo',
            pageWidth / 2,
            pageHeight - 5,
            { align: 'center' }
          )
        }

        // Guardar PDF
        const fileName = `ficha-social-${ficha.apellido_paterno || ficha.apellidos}-${ficha.nombres}.pdf`.replace(/\s+/g, '-')
        doc.save(fileName)

        // Redirigir después de la descarga
        setTimeout(() => {
          router.push(`/fichas-sociales/${fichaId}`)
        }, 1000)

      } catch (err: any) {
        console.error('Error al generar PDF:', err)
        setError(err.message || 'Error al generar el PDF')
      } finally {
        setLoading(false)
      }
    }

    if (fichaId && user) {
      generatePDF()
    }
  }, [fichaId, user, router])

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generando PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Error al generar PDF</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => router.push('/fichas-sociales')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Volver al listado
          </button>
        </div>
      </div>
    )
  }

  return null
}
