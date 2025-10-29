'use client'

import React from 'react'
import { useFichaSocialForm } from '@/context/FichaSocialFormContext'
import InputField from '@/components/InputField'

export default function ViviendaSaludTab() {
  const { formData, errors, updateNestedField } = useFichaSocialForm()

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    const currentArray = formData.datos_vivienda[category as keyof typeof formData.datos_vivienda] as string[]
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value)
    updateNestedField(`datos_vivienda.${category}`, newArray)
  }

  const isChecked = (category: string, value: string): boolean => {
    const array = formData.datos_vivienda[category as keyof typeof formData.datos_vivienda] as string[]
    return array.includes(value)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Vivienda y Salud</h3>

      {/* Datos de Vivienda */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-yellow-900 mb-4">Datos de Vivienda</h4>

        {/* Tipo de Vivienda */}
        <div className="mb-4">
          <label htmlFor="tipo_vivienda" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Vivienda <span className="text-red-500">*</span>
          </label>
          <select
            id="tipo_vivienda"
            value={formData.datos_vivienda.tipo_vivienda || ''}
            onChange={(e) => updateNestedField('datos_vivienda.tipo_vivienda', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.tipo_vivienda ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione...</option>
            <option value="Casa independiente">Casa independiente</option>
            <option value="Departamento">Departamento</option>
            <option value="Casa en quinta">Casa en quinta</option>
            <option value="Vivienda improvisada">Vivienda improvisada</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.tipo_vivienda && <p className="text-red-500 text-sm mt-1">{errors.tipo_vivienda}</p>}
        </div>

        {/* Material de Construcción */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material de Construcción
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Ladrillo', 'Adobe', 'Madera', 'Estera', 'Material noble', 'Prefabricado'].map(material => (
              <label key={material} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked('material', material)}
                  onChange={(e) => handleCheckboxChange('material', material, e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{material}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tenencia de Vivienda */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tenencia de Vivienda
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Propia', 'Alquilada', 'Prestada', 'Hipotecada', 'Invasión'].map(tenencia => (
              <label key={tenencia} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked('tenencia', tenencia)}
                  onChange={(e) => handleCheckboxChange('tenencia', tenencia, e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{tenencia}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Servicios Básicos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicios Básicos
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Agua potable', 'Desagüe', 'Luz eléctrica', 'Internet', 'Teléfono', 'Cable'].map(servicio => (
              <label key={servicio} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked('servicios', servicio)}
                  onChange={(e) => handleCheckboxChange('servicios', servicio, e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{servicio}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ubicación */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación de la Vivienda
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Zona urbana', 'Zona rural', 'Zona periférica', 'Asentamiento humano'].map(ubicacion => (
              <label key={ubicacion} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked('ubicacion', ubicacion)}
                  onChange={(e) => handleCheckboxChange('ubicacion', ubicacion, e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{ubicacion}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Problemas Sociales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Problemas Sociales en la Zona
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Delincuencia', 'Pandillaje', 'Drogadicción', 'Alcoholismo', 'Violencia familiar', 'Ninguno'].map(problema => (
              <label key={problema} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked('problemas_sociales', problema)}
                  onChange={(e) => handleCheckboxChange('problemas_sociales', problema, e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{problema}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Datos de Salud */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-green-900 mb-4">Datos de Salud</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Seguro */}
          <div>
            <label htmlFor="tipo_seguro" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Seguro <span className="text-red-500">*</span>
            </label>
            <select
              id="tipo_seguro"
              value={formData.datos_salud.tipo_seguro || ''}
              onChange={(e) => updateNestedField('datos_salud.tipo_seguro', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.tipo_seguro ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccione...</option>
              <option value="SIS">SIS</option>
              <option value="EsSalud">EsSalud</option>
              <option value="Privado">Privado</option>
              <option value="Ninguno">Ninguno</option>
            </select>
            {errors.tipo_seguro && <p className="text-red-500 text-sm mt-1">{errors.tipo_seguro}</p>}
          </div>

          {/* Grupo Sanguíneo */}
          <div>
            <label htmlFor="grupo_sanguineo" className="block text-sm font-medium text-gray-700 mb-1">
              Grupo Sanguíneo <span className="text-red-500">*</span>
            </label>
            <select
              id="grupo_sanguineo"
              value={formData.datos_salud.grupo_sanguineo || ''}
              onChange={(e) => updateNestedField('datos_salud.grupo_sanguineo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.grupo_sanguineo ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccione...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.grupo_sanguineo && <p className="text-red-500 text-sm mt-1">{errors.grupo_sanguineo}</p>}
          </div>
        </div>

        {/* Alergias */}
        <div className="mt-4">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={formData.datos_salud.alergias.tiene}
              onChange={(e) => updateNestedField('datos_salud.alergias.tiene', e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">¿Tiene alergias?</span>
          </label>
          {formData.datos_salud.alergias.tiene && (
            <InputField
              id="alergias_especificar"
              label="Especificar alergias"
              type="text"
              value={formData.datos_salud.alergias.especificar || ''}
              onChange={(e) => updateNestedField('datos_salud.alergias.especificar', e.target.value)}
              placeholder="Detalle las alergias"
            />
          )}
        </div>

        {/* Enfermedades */}
        <div className="mt-4">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={formData.datos_salud.enfermedades.tiene}
              onChange={(e) => updateNestedField('datos_salud.enfermedades.tiene', e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">¿Tiene enfermedades crónicas?</span>
          </label>
          {formData.datos_salud.enfermedades.tiene && (
            <InputField
              id="enfermedades_especificar"
              label="Especificar enfermedades"
              type="text"
              value={formData.datos_salud.enfermedades.especificar || ''}
              onChange={(e) => updateNestedField('datos_salud.enfermedades.especificar', e.target.value)}
              placeholder="Detalle las enfermedades"
            />
          )}
        </div>

        {/* Discapacidad */}
        <div className="mt-4">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={formData.datos_salud.discapacidad?.tiene || false}
              onChange={(e) => updateNestedField('datos_salud.discapacidad.tiene', e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">¿Tiene alguna discapacidad?</span>
          </label>
          {formData.datos_salud.discapacidad?.tiene && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <InputField
                id="discapacidad_tipo"
                label="Tipo de discapacidad"
                type="text"
                value={formData.datos_salud.discapacidad?.tipo || ''}
                onChange={(e) => updateNestedField('datos_salud.discapacidad.tipo', e.target.value)}
              />
              <div>
                <label htmlFor="discapacidad_grado" className="block text-sm font-medium text-gray-700 mb-1">
                  Grado
                </label>
                <select
                  id="discapacidad_grado"
                  value={formData.datos_salud.discapacidad?.grado || ''}
                  onChange={(e) => updateNestedField('datos_salud.discapacidad.grado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione...</option>
                  <option value="Leve">Leve</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Grave">Grave</option>
                  <option value="Muy grave">Muy grave</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
