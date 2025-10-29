'use client'

import React from 'react'
import { useFichaSocialForm } from '@/context/FichaSocialFormContext'
import InputField from '@/components/InputField'

export default function DatosEstudianteTab() {
  const { formData, errors, updateFormData } = useFichaSocialForm()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos del Estudiante</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Apellido Paterno */}
        <InputField
          id="apellido_paterno"
          label="Apellido Paterno"
          type="text"
          value={formData.apellido_paterno}
          onChange={(e) => updateFormData('apellido_paterno', e.target.value)}
          error={errors.apellido_paterno}
          required
        />

        {/* Apellido Materno */}
        <InputField
          id="apellido_materno"
          label="Apellido Materno"
          type="text"
          value={formData.apellido_materno}
          onChange={(e) => updateFormData('apellido_materno', e.target.value)}
          error={errors.apellido_materno}
          required
        />

        {/* Nombres */}
        <InputField
          id="nombres"
          label="Nombres"
          type="text"
          value={formData.nombres}
          onChange={(e) => updateFormData('nombres', e.target.value)}
          error={errors.nombres}
          required
        />

        {/* Sexo */}
        <div>
          <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
            Sexo <span className="text-red-500">*</span>
          </label>
          <select
            id="sexo"
            value={formData.sexo}
            onChange={(e) => updateFormData('sexo', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sexo ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {errors.sexo && <p className="text-red-500 text-sm mt-1">{errors.sexo}</p>}
        </div>

        {/* Fecha de Nacimiento */}
        <InputField
          id="fecha_nacimiento"
          label="Fecha de Nacimiento"
          type="date"
          value={formData.fecha_nacimiento}
          onChange={(e) => updateFormData('fecha_nacimiento', e.target.value)}
          error={errors.fecha_nacimiento}
          required
        />

        {/* Edad (calculada automáticamente) */}
        <InputField
          id="edad"
          label="Edad"
          type="number"
          value={formData.edad?.toString() || ''}
          disabled
          readOnly
        />

        {/* Nacionalidad */}
        <div>
          <label htmlFor="nacionalidad" className="block text-sm font-medium text-gray-700 mb-1">
            Nacionalidad <span className="text-red-500">*</span>
          </label>
          <select
            id="nacionalidad"
            value={formData.nacionalidad}
            onChange={(e) => updateFormData('nacionalidad', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nacionalidad ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Peruana">Peruana</option>
            <option value="Venezolana">Venezolana</option>
            <option value="Colombiana">Colombiana</option>
            <option value="Ecuatoriana">Ecuatoriana</option>
            <option value="Boliviana">Boliviana</option>
            <option value="Chilena">Chilena</option>
            <option value="Argentina">Argentina</option>
            <option value="Otra">Otra</option>
          </select>
          {errors.nacionalidad && <p className="text-red-500 text-sm mt-1">{errors.nacionalidad}</p>}
        </div>

        {/* DNI o Carné de Extranjería */}
        {formData.nacionalidad === 'Peruana' ? (
          <InputField
            id="dni"
            label="DNI"
            type="text"
            value={formData.dni}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 8)
              updateFormData('dni', value)
            }}
            error={errors.dni}
            maxLength={8}
            required
            placeholder="8 dígitos"
          />
        ) : (
          <InputField
            id="carne_extranjeria"
            label="Carné de Extranjería"
            type="text"
            value={formData.carne_extranjeria}
            onChange={(e) => updateFormData('carne_extranjeria', e.target.value)}
            error={errors.carne_extranjeria}
            required
          />
        )}
      </div>

      {/* Información Académica */}
      <h4 className="text-lg font-medium text-gray-700 mt-6 mb-3">Información Académica</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Grado */}
        <div>
          <label htmlFor="grado" className="block text-sm font-medium text-gray-700 mb-1">
            Grado <span className="text-red-500">*</span>
          </label>
          <select
            id="grado"
            value={formData.grado}
            onChange={(e) => updateFormData('grado', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.grado ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione...</option>
            <option value="1ro Primaria">1ro Primaria</option>
            <option value="2do Primaria">2do Primaria</option>
            <option value="3ro Primaria">3ro Primaria</option>
            <option value="4to Primaria">4to Primaria</option>
            <option value="5to Primaria">5to Primaria</option>
            <option value="6to Primaria">6to Primaria</option>
            <option value="1ro Secundaria">1ro Secundaria</option>
            <option value="2do Secundaria">2do Secundaria</option>
            <option value="3ro Secundaria">3ro Secundaria</option>
            <option value="4to Secundaria">4to Secundaria</option>
            <option value="5to Secundaria">5to Secundaria</option>
          </select>
          {errors.grado && <p className="text-red-500 text-sm mt-1">{errors.grado}</p>}
        </div>

        {/* Sección */}
        <div>
          <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-1">
            Sección <span className="text-red-500">*</span>
          </label>
          <select
            id="seccion"
            value={formData.seccion}
            onChange={(e) => updateFormData('seccion', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.seccion ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione...</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          {errors.seccion && <p className="text-red-500 text-sm mt-1">{errors.seccion}</p>}
        </div>

        {/* Nivel Educativo */}
        <div>
          <label htmlFor="nivel_educativo" className="block text-sm font-medium text-gray-700 mb-1">
            Nivel Educativo
          </label>
          <select
            id="nivel_educativo"
            value={formData.nivel_educativo}
            onChange={(e) => updateFormData('nivel_educativo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione...</option>
            <option value="Primaria">Primaria</option>
            <option value="Secundaria">Secundaria</option>
          </select>
        </div>
      </div>

      {/* Información Adicional */}
      <h4 className="text-lg font-medium text-gray-700 mt-6 mb-3">Información Adicional</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estado Civil */}
        <div>
          <label htmlFor="estado_civil" className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil
          </label>
          <select
            id="estado_civil"
            value={formData.estado_civil}
            onChange={(e) => updateFormData('estado_civil', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="soltero">Soltero(a)</option>
            <option value="conviviente">Conviviente</option>
            <option value="casado">Casado(a)</option>
            <option value="separado">Separado(a)</option>
            <option value="viudo">Viudo(a)</option>
          </select>
        </div>

        {/* Número de Hijos */}
        <InputField
          id="num_hijos"
          label="Número de Hijos"
          type="number"
          value={formData.num_hijos.toString()}
          onChange={(e) => updateFormData('num_hijos', parseInt(e.target.value) || 0)}
          min={0}
        />

        {/* Domicilio Actual */}
        <div className="md:col-span-2">
          <InputField
            id="domicilio_actual"
            label="Domicilio Actual"
            type="text"
            value={formData.domicilio_actual}
            onChange={(e) => updateFormData('domicilio_actual', e.target.value)}
            error={errors.domicilio_actual}
            required
            placeholder="Dirección completa"
          />
        </div>

        {/* Distrito */}
        <InputField
          id="distrito"
          label="Distrito"
          type="text"
          value={formData.distrito}
          onChange={(e) => updateFormData('distrito', e.target.value)}
          error={errors.distrito}
          required
        />
      </div>
    </div>
  )
}
