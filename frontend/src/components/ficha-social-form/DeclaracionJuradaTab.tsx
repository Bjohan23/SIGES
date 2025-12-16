'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFichaSocialForm } from '@/context/FichaSocialFormContext'
import InputField from '@/components/InputField'

export default function DeclaracionJuradaTab() {
  const { formData, errors, updateNestedField } = useFichaSocialForm()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    // Si ya hay una firma guardada, dibujarla en el canvas
    if (formData.declaracion_jurada.firma_digital && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          setHasSignature(true)
        }
        img.src = formData.declaracion_jurada.firma_digital
      }
    }
  }, [formData.declaracion_jurada.firma_digital])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let x, y
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let x, y
    if ('touches' in e) {
      e.preventDefault()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineTo(x, y)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current
      const dataUrl = canvas.toDataURL('image/png')
      updateNestedField('declaracion_jurada.firma_digital', dataUrl)

      // Actualizar fecha de firma automáticamente
      if (!formData.declaracion_jurada.fecha_firma) {
        const now = new Date().toISOString()
        updateNestedField('declaracion_jurada.fecha_firma', now)
      }
    }
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateNestedField('declaracion_jurada.firma_digital', '')
    setHasSignature(false)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Declaración Jurada</h3>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-blue-900 mb-4">Declaración</h4>

        <div className="bg-white p-4 rounded-md mb-4 border border-blue-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            Yo, <strong>{formData.declaracion_jurada.nombre_firmante || '__________________'}</strong>,
            declaro bajo juramento que la información proporcionada en esta ficha social es verdadera y completa.
            Comprendo que cualquier falsedad u omisión de información puede resultar en la descalificación del beneficiario
            de los programas de apoyo social que brinda la institución.
          </p>
          <p className="text-sm text-gray-700 mt-3">
            Asimismo, autorizo a la institución a verificar la información proporcionada y a realizar visitas domiciliarias
            de ser necesario.
          </p>
        </div>

        {/* Nombre del Firmante */}
        <div className="mb-4">
          <InputField
            id="nombre_firmante"
            label="Nombre Completo del Firmante"
            type="text"
            value={formData.declaracion_jurada.nombre_firmante}
            onChange={(e) => updateNestedField('declaracion_jurada.nombre_firmante', e.target.value)}
            error={errors.nombre_firmante}
            required
            placeholder="Ingrese su nombre completo"
          />
        </div>

        {/* Aceptación de Términos */}
        <div className="mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.declaracion_jurada.acepta_terminos}
              onChange={(e) => updateNestedField('declaracion_jurada.acepta_terminos', e.target.checked)}
              className="mt-1 rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">
              Acepto que he leído y comprendo la declaración jurada. Confirmo que toda la información proporcionada
              es verdadera y precisa. <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.acepta_terminos && (
            <p className="text-red-500 text-sm mt-1">{errors.acepta_terminos}</p>
          )}
        </div>

        {/* Firma Digital */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Firma Digital <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Dibuje su firma en el recuadro utilizando el mouse o su dedo (en pantallas táctiles)
          </p>

          <div className="border-2 border-gray-300 rounded-md bg-white p-2">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full border border-gray-200 rounded cursor-crosshair touch-none"
              style={{ touchAction: 'none' }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={clearSignature}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Limpiar Firma
            </button>
            {hasSignature && (
              <span className="text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Firma registrada
              </span>
            )}
          </div>

          {errors.firma_digital && (
            <p className="text-red-500 text-sm mt-1">{errors.firma_digital}</p>
          )}
        </div>

        {/* Fecha de Firma (automática) */}
        {formData.declaracion_jurada.fecha_firma && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Fecha de firma: {new Date(formData.declaracion_jurada.fecha_firma).toLocaleString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>

      {/* Información Adicional */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800 mb-1">Importante</p>
            <p className="text-sm text-yellow-700">
              Asegúrese de que toda la información proporcionada sea correcta antes de firmar.
              Una vez guardada la ficha, se registrará como declaración jurada oficial.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
