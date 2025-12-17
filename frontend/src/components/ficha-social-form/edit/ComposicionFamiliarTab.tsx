"use client";

import React from "react";
import { useFichaSocialForm } from "../FormContextWrapper";
import InputField from "@/components/InputField";

export default function ComposicionFamiliarTab() {
  const { formData, updateFormData, updateNestedField } = useFichaSocialForm();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Composición Familiar</h3>

      {/* Datos del Padre */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">Datos del Padre</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="padre_apellido_paterno"
            label="Apellido Paterno"
            type="text"
            value={formData.composicion_familiar?.padre?.apellido_paterno || ''}
            onChange={(e) => updateNestedField("composicion_familiar.padre.apellido_paterno", e.target.value)}
          />
          <InputField
            id="padre_apellido_materno"
            label="Apellido Materno"
            type="text"
            value={formData.composicion_familiar?.padre?.apellido_materno || ''}
            onChange={(e) => updateNestedField("composicion_familiar.padre.apellido_materno", e.target.value)}
          />
          <InputField
            id="padre_nombres"
            label="Nombres"
            type="text"
            value={formData.composicion_familiar?.padre?.nombres || ''}
            onChange={(e) => updateNestedField("composicion_familiar.padre.nombres", e.target.value)}
          />
          <InputField
            id="padre_edad"
            label="Edad"
            type="number"
            value={formData.composicion_familiar?.padre?.edad || ''}
            onChange={(e) => updateNestedField("composicion_familiar.padre.edad", e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <InputField
            id="padre_ocupacion"
            label="Ocupación"
            type="text"
            value={formData.composicion_familiar?.padre?.ocupacion || ''}
            onChange={(e) => updateNestedField("composicion_familiar.padre.ocupacion", e.target.value)}
          />
          <InputField
            id="padre_celular"
            label="Celular"
            type="text"
            value={formData.composicion_familiar?.padre?.celular || ''}
            onChange={(e) => updateNestedField("composicion_familiar.padre.celular", e.target.value)}
          />
        </div>
      </div>

      {/* Datos de la Madre */}
      <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-pink-900 dark:text-pink-100 mb-4">Datos de la Madre</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="madre_apellido_paterno"
            label="Apellido Paterno"
            type="text"
            value={formData.composicion_familiar?.madre?.apellido_paterno || ''}
            onChange={(e) => updateNestedField("composicion_familiar.madre.apellido_paterno", e.target.value)}
          />
          <InputField
            id="madre_apellido_materno"
            label="Apellido Materno"
            type="text"
            value={formData.composicion_familiar?.madre?.apellido_materno || ''}
            onChange={(e) => updateNestedField("composicion_familiar.madre.apellido_materno", e.target.value)}
          />
          <InputField
            id="madre_nombres"
            label="Nombres"
            type="text"
            value={formData.composicion_familiar?.madre?.nombres || ''}
            onChange={(e) => updateNestedField("composicion_familiar.madre.nombres", e.target.value)}
          />
          <InputField
            id="madre_edad"
            label="Edad"
            type="number"
            value={formData.composicion_familiar?.madre?.edad || ''}
            onChange={(e) => updateNestedField("composicion_familiar.madre.edad", e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <InputField
            id="madre_ocupacion"
            label="Ocupación"
            type="text"
            value={formData.composicion_familiar?.madre?.ocupacion || ''}
            onChange={(e) => updateNestedField("composicion_familiar.madre.ocupacion", e.target.value)}
          />
          <InputField
            id="madre_celular"
            label="Celular"
            type="text"
            value={formData.composicion_familiar?.madre?.celular || ''}
            onChange={(e) => updateNestedField("composicion_familiar.madre.celular", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}