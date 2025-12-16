'use client'

import React from 'react'
import { useFichaSocialForm } from '@/context/FichaSocialFormContext'
import InputField from '@/components/InputField'

export default function ComposicionFamiliarTab() {
  const { formData, errors, updateNestedField } = useFichaSocialForm()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Composición Familiar</h3>

      {/* Datos del Padre */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-blue-900 mb-4">Datos del Padre</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="padre_apellido_paterno"
            label="Apellido Paterno"
            type="text"
            value={formData.composicion_familiar.padre.apellido_paterno}
            onChange={(e) => updateNestedField('composicion_familiar.padre.apellido_paterno', e.target.value)}
            error={errors['padre.apellido_paterno']}
            required
          />

          <InputField
            id="padre_apellido_materno"
            label="Apellido Materno"
            type="text"
            value={formData.composicion_familiar.padre.apellido_materno}
            onChange={(e) => updateNestedField('composicion_familiar.padre.apellido_materno', e.target.value)}
            error={errors['padre.apellido_materno']}
            required
          />

          <InputField
            id="padre_nombres"
            label="Nombres"
            type="text"
            value={formData.composicion_familiar.padre.nombres}
            onChange={(e) => updateNestedField('composicion_familiar.padre.nombres', e.target.value)}
            error={errors['padre.nombres']}
            required
          />

          <InputField
            id="padre_edad"
            label="Edad"
            type="number"
            value={formData.composicion_familiar.padre.edad?.toString() || ''}
            onChange={(e) => updateNestedField('composicion_familiar.padre.edad', parseInt(e.target.value) || null)}
            error={errors['padre.edad']}
            min={18}
            max={120}
            required
          />

          <InputField
            id="padre_ocupacion"
            label="Ocupación"
            type="text"
            value={formData.composicion_familiar.padre.ocupacion}
            onChange={(e) => updateNestedField('composicion_familiar.padre.ocupacion', e.target.value)}
            error={errors['padre.ocupacion']}
            required
          />

          <InputField
            id="padre_centro_laboral"
            label="Centro Laboral"
            type="text"
            value={formData.composicion_familiar.padre.centro_laboral}
            onChange={(e) => updateNestedField('composicion_familiar.padre.centro_laboral', e.target.value)}
            placeholder="Opcional"
          />

          <InputField
            id="padre_celular"
            label="Celular"
            type="tel"
            value={formData.composicion_familiar.padre.celular}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 9)
              updateNestedField('composicion_familiar.padre.celular', value)
            }}
            error={errors['padre.celular']}
            maxLength={9}
            required
            placeholder="9 dígitos"
          />
        </div>
      </div>

      {/* Datos de la Madre */}
      <div className="bg-pink-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-pink-900 mb-4">Datos de la Madre</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="madre_apellido_paterno"
            label="Apellido Paterno"
            type="text"
            value={formData.composicion_familiar.madre.apellido_paterno}
            onChange={(e) => updateNestedField('composicion_familiar.madre.apellido_paterno', e.target.value)}
            error={errors['madre.apellido_paterno']}
            required
          />

          <InputField
            id="madre_apellido_materno"
            label="Apellido Materno"
            type="text"
            value={formData.composicion_familiar.madre.apellido_materno}
            onChange={(e) => updateNestedField('composicion_familiar.madre.apellido_materno', e.target.value)}
            error={errors['madre.apellido_materno']}
            required
          />

          <InputField
            id="madre_nombres"
            label="Nombres"
            type="text"
            value={formData.composicion_familiar.madre.nombres}
            onChange={(e) => updateNestedField('composicion_familiar.madre.nombres', e.target.value)}
            error={errors['madre.nombres']}
            required
          />

          <InputField
            id="madre_edad"
            label="Edad"
            type="number"
            value={formData.composicion_familiar.madre.edad?.toString() || ''}
            onChange={(e) => updateNestedField('composicion_familiar.madre.edad', parseInt(e.target.value) || null)}
            error={errors['madre.edad']}
            min={18}
            max={120}
            required
          />

          <InputField
            id="madre_ocupacion"
            label="Ocupación"
            type="text"
            value={formData.composicion_familiar.madre.ocupacion}
            onChange={(e) => updateNestedField('composicion_familiar.madre.ocupacion', e.target.value)}
            error={errors['madre.ocupacion']}
            required
          />

          <InputField
            id="madre_centro_laboral"
            label="Centro Laboral"
            type="text"
            value={formData.composicion_familiar.madre.centro_laboral}
            onChange={(e) => updateNestedField('composicion_familiar.madre.centro_laboral', e.target.value)}
            placeholder="Opcional"
          />

          <InputField
            id="madre_celular"
            label="Celular"
            type="tel"
            value={formData.composicion_familiar.madre.celular}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 9)
              updateNestedField('composicion_familiar.madre.celular', value)
            }}
            error={errors['madre.celular']}
            maxLength={9}
            required
            placeholder="9 dígitos"
          />
        </div>
      </div>
    </div>
  )
}
