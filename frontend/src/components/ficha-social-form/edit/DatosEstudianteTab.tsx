"use client";

import React from "react";
import { useFichaSocialForm } from "../FormContextWrapper";
import InputField from "@/components/InputField";

export default function DatosEstudianteTab() {
  const { formData, errors, updateFormData } = useFichaSocialForm();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos del Estudiante</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Apellido Paterno */}
        <InputField
          id="apellido_paterno"
          label="Apellido Paterno"
          type="text"
          value={formData.apellido_paterno || ''}
          onChange={(e) => updateFormData("apellido_paterno", e.target.value)}
          error={errors.apellido_paterno}
          required
        />

        {/* Apellido Materno */}
        <InputField
          id="apellido_materno"
          label="Apellido Materno"
          type="text"
          value={formData.apellido_materno || ''}
          onChange={(e) => updateFormData("apellido_materno", e.target.value)}
          error={errors.apellido_materno}
          required
        />

        {/* Nombres */}
        <InputField
          id="nombres"
          label="Nombres"
          type="text"
          value={formData.nombres || ''}
          onChange={(e) => updateFormData("nombres", e.target.value)}
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
            value={formData.sexo || ''}
            onChange={(e) => updateFormData("sexo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Seleccione...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {errors.sexo && (
            <p className="mt-1 text-sm text-red-600">{errors.sexo}</p>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <InputField
          id="fecha_nacimiento"
          label="Fecha de Nacimiento"
          type="date"
          value={formData.fecha_nacimiento || ''}
          onChange={(e) => updateFormData("fecha_nacimiento", e.target.value)}
          error={errors.fecha_nacimiento}
          required
        />

        {/* Edad */}
        <InputField
          id="edad"
          label="Edad"
          type="number"
          value={formData.edad || ''}
          onChange={(e) => updateFormData("edad", e.target.value ? parseInt(e.target.value) : undefined)}
          error={errors.edad}
          min="0"
          max="120"
        />

        {/* Nacionalidad */}
        <div>
          <label htmlFor="nacionalidad" className="block text-sm font-medium text-gray-700 mb-1">
            Nacionalidad <span className="text-red-500">*</span>
          </label>
          <select
            id="nacionalidad"
            value={formData.nacionalidad || 'Peruana'}
            onChange={(e) => updateFormData("nacionalidad", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="Peruana">Peruana</option>
            <option value="Extranjera">Extranjera</option>
          </select>
          {errors.nacionalidad && (
            <p className="mt-1 text-sm text-red-600">{errors.nacionalidad}</p>
          )}
        </div>

        {/* DNI o Carné de Extranjería */}
        {(formData.nacionalidad === 'Peruana' || !formData.nacionalidad) ? (
          <InputField
            id="dni"
            label="DNI"
            type="text"
            value={formData.dni || ''}
            onChange={(e) => updateFormData("dni", e.target.value)}
            error={errors.dni}
            maxLength={8}
            pattern="[0-9]{8}"
            placeholder="8 dígitos"
            required
          />
        ) : (
          <InputField
            id="carne_extranjeria"
            label="Carné de Extranjería"
            type="text"
            value={formData.carne_extranjeria || ''}
            onChange={(e) => updateFormData("carne_extranjeria", e.target.value)}
            error={errors.carne_extranjeria}
            required
          />
        )}

        {/* Grado */}
        <InputField
          id="grado"
          label="Grado"
          type="text"
          value={formData.grado || ''}
          onChange={(e) => updateFormData("grado", e.target.value)}
          error={errors.grado}
        />

        {/* Sección */}
        <InputField
          id="seccion"
          label="Sección"
          type="text"
          value={formData.seccion || ''}
          onChange={(e) => updateFormData("seccion", e.target.value)}
          error={errors.seccion}
        />

        {/* Nivel Educativo */}
        <div>
          <label htmlFor="nivel_educativo" className="block text-sm font-medium text-gray-700 mb-1">
            Nivel Educativo
          </label>
          <select
            id="nivel_educativo"
            value={formData.nivel_educativo || ''}
            onChange={(e) => updateFormData("nivel_educativo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccione...</option>
            <option value="Inicial">Inicial</option>
            <option value="Primaria">Primaria</option>
            <option value="Secundaria">Secundaria</option>
            <option value="Superior">Superior</option>
          </select>
          {errors.nivel_educativo && (
            <p className="mt-1 text-sm text-red-600">{errors.nivel_educativo}</p>
          )}
        </div>

        {/* Estado Civil */}
        <div>
          <label htmlFor="estado_civil" className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil
          </label>
          <select
            id="estado_civil"
            value={formData.estado_civil || ''}
            onChange={(e) => updateFormData("estado_civil", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccione...</option>
            <option value="SOLTERO">Soltero(a)</option>
            <option value="CASADO">Casado(a)</option>
            <option value="DIVORCIADO">Divorciado(a)</option>
            <option value="VIUDO">Viudo(a)</option>
            <option value="CONVIVIENTE">Conviviente</option>
          </select>
          {errors.estado_civil && (
            <p className="mt-1 text-sm text-red-600">{errors.estado_civil}</p>
          )}
        </div>

        {/* Número de Hijos */}
        <InputField
          id="num_hijos"
          label="Número de Hijos"
          type="number"
          value={formData.num_hijos || 0}
          onChange={(e) => updateFormData("num_hijos", e.target.value ? parseInt(e.target.value) : 0)}
          error={errors.num_hijos}
          min="0"
        />

        {/* Domicilio Actual */}
        <div className="md:col-span-2">
          <InputField
            id="domicilio_actual"
            label="Domicilio Actual"
            type="text"
            value={formData.domicilio_actual || ''}
            onChange={(e) => updateFormData("domicilio_actual", e.target.value)}
            error={errors.domicilio_actual}
            required
          />
        </div>

        {/* Distrito */}
        <InputField
          id="distrito"
          label="Distrito"
          type="text"
          value={formData.distrito || ''}
          onChange={(e) => updateFormData("distrito", e.target.value)}
          error={errors.distrito}
          required
        />
      </div>
    </div>
  );
}