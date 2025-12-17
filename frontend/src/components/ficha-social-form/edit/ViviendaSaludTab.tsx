"use client";

import React from "react";
import { useFichaSocialForm } from "../FormContextWrapper";
import InputField from "@/components/InputField";

export default function ViviendaSaludTab() {
  const { formData, updateFormData, updateNestedField } = useFichaSocialForm();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Vivienda y Salud</h3>

      {/* Datos de Vivienda */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-orange-900 dark:text-orange-100 mb-4">Datos de Vivienda</h4>

        <div className="mb-4">
          <label htmlFor="tipo_vivienda" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Vivienda
          </label>
          <select
            id="tipo_vivienda"
            value={formData.datos_vivienda?.tipo_vivienda || ''}
            onChange={(e) => updateNestedField("datos_vivienda.tipo_vivienda", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccione...</option>
            <option value="Casa independiente">Casa independiente</option>
            <option value="Departamento">Departamento</option>
            <option value="Cuarto en casa">Cuarto en casa</option>
            <option value="Vivienda rural">Vivienda rural</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material de Construcción
            </label>
            <div className="space-y-2">
              {[
                "Adobe",
                "Madera",
                "Prefabricado",
                "Estera",
                "Ladrillo",
                "Material noble"
              ].map((material) => (
                <label key={material} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.datos_vivienda?.material?.includes(material) || false}
                    onChange={(e) => {
                      const current = formData.datos_vivienda?.material || [];
                      if (e.target.checked) {
                        updateNestedField("datos_vivienda.material", [...current, material]);
                      } else {
                        updateNestedField("datos_vivienda.material", current.filter((m: string) => m !== material));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{material}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenencia
            </label>
            <div className="space-y-2">
              {[
                "Hipotecada",
                "Invasión",
                "Propia",
                "Alquilada",
                "Prestada"
              ].map((tenencia) => (
                <label key={tenencia} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.datos_vivienda?.tenencia?.includes(tenencia) || false}
                    onChange={(e) => {
                      const current = formData.datos_vivienda?.tenencia || [];
                      if (e.target.checked) {
                        updateNestedField("datos_vivienda.tenencia", [...current, tenencia]);
                      } else {
                        updateNestedField("datos_vivienda.tenencia", current.filter((t: string) => t !== tenencia));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{tenencia}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Datos de Salud */}
      <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-teal-900 dark:text-teal-100 mb-4">Datos de Salud</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipo_seguro" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Seguro
            </label>
            <select
              id="tipo_seguro"
              value={formData.datos_salud?.tipo_seguro || ''}
              onChange={(e) => updateNestedField("datos_salud.tipo_seguro", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Seleccione...</option>
              <option value="SIS">SIS</option>
              <option value="Essalud">Essalud</option>
              <option value="Privado">Privado</option>
              <option value="No tiene">No tiene</option>
            </select>
          </div>

          <div>
            <label htmlFor="grupo_sanguineo" className="block text-sm font-medium text-gray-700 mb-1">
              Grupo Sanguíneo
            </label>
            <select
              id="grupo_sanguineo"
              value={formData.datos_salud?.grupo_sanguineo || ''}
              onChange={(e) => updateNestedField("datos_salud.grupo_sanguineo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alergias
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={formData.datos_salud?.alergias?.tiene || false}
                onChange={(e) => updateNestedField("datos_salud.alergias.tiene", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Tiene alergias</span>
            </label>
            {formData.datos_salud?.alergias?.tiene && (
              <InputField
                id="alergias_especificar"
                label="Especificar"
                type="text"
                value={formData.datos_salud?.alergias?.especificar || ''}
                onChange={(e) => updateNestedField("datos_salud.alergias.especificar", e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enfermedades Crónicas
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={formData.datos_salud?.enfermedades?.tiene || false}
                onChange={(e) => updateNestedField("datos_salud.enfermedades.tiene", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Tiene enfermedades crónicas</span>
            </label>
            {formData.datos_salud?.enfermedades?.tiene && (
              <InputField
                id="enfermedades_especificar"
                label="Especificar"
                type="text"
                value={formData.datos_salud?.enfermedades?.especificar || ''}
                onChange={(e) => updateNestedField("datos_salud.enfermedades.especificar", e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}