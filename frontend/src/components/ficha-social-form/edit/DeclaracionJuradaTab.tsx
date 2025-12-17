"use client";

import React from "react";
import { useFichaSocialForm } from "../FormContextWrapper";
import InputField from "@/components/InputField";

export default function DeclaracionJuradaTab() {
  const { formData, updateFormData, updateNestedField } = useFichaSocialForm();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Declaración Jurada</h3>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-4">
            Declaro bajo juramento que la información proporcionada es veraz
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Por este medio, declaro que todos los datos consignados en la presente ficha social son
            veraces y corresponden a la realidad. Me comprometo a informar cualquier cambio que
            pudiera ocurrir en las circunstancias aquí declaradas.
          </p>
        </div>

        {/* Nombre del Firmante */}
        <div className="mb-6">
          <InputField
            id="nombre_firmante"
            label="Nombre del Firmante"
            type="text"
            value={formData.declaracion_jurada?.nombre_firmante || ''}
            onChange={(e) => updateNestedField("declaracion_jurada.nombre_firmante", e.target.value)}
            placeholder="Ingrese su nombre completo"
            required
          />
        </div>

        {/* Fecha de Firma */}
        <div className="mb-6">
          <InputField
            id="fecha_firma"
            label="Fecha de Firma"
            type="date"
            value={formData.declaracion_jurada?.fecha_firma || new Date().toISOString().split('T')[0]}
            onChange={(e) => updateNestedField("declaracion_jurada.fecha_firma", e.target.value)}
            required
          />
        </div>

        {/* Aceptación de Términos */}
        <div className="mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acepta_terminos"
              checked={formData.declaracion_jurada?.acepta_terminos || false}
              onChange={(e) => updateNestedField("declaracion_jurada.acepta_terminos", e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
              required
            />
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Acepto los términos y condiciones</span>
              <p className="mt-1">
                Declaro que he leído y acepto los términos de la declaración jurada,
                entendiendo que cualquier falsedad en la información proporcionada
                podría acarrear las consecuencias legales correspondientes.
              </p>
            </div>
          </label>
        </div>

        {/* Firma Digital (si existe) */}
        {formData.declaracion_jurada?.firma_digital && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Firma Digital Existente
            </label>
            <div className="border-2 border-gray-200 dark:border-gray-600 rounded p-4 bg-gray-50 dark:bg-gray-700">
              <img
                src={formData.declaracion_jurada.firma_digital}
                alt="Firma Digital Existente"
                className="max-w-full h-auto max-h-32"
              />
            </div>
          </div>
        )}

        {/* Resumen de la Declaración */}
        <div className="border-t border-purple-200 dark:border-purple-800 pt-6">
          <h4 className="text-md font-medium text-purple-900 dark:text-purple-100 mb-3">
            Resumen de la Declaración
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Nombre del firmante:</span>
              <span className="font-medium">{formData.declaracion_jurada?.nombre_firmante || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha de firma:</span>
              <span className="font-medium">
                {formData.declaracion_jurada?.fecha_firma ?
                  new Date(formData.declaracion_jurada.fecha_firma).toLocaleDateString('es-PE') :
                  'No especificada'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Términos aceptados:</span>
              <span className={`font-medium ${formData.declaracion_jurada?.acepta_terminos ? 'text-green-600' : 'text-red-600'}`}>
                {formData.declaracion_jurada?.acepta_terminos ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Validación */}
        {!formData.declaracion_jurada?.nombre_firmante || !formData.declaracion_jurada?.acepta_terminos ? (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Por favor complete todos los campos obligatorios de la declaración jurada.
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ Declaración jurada completa y lista para guardar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}