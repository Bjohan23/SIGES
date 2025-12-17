"use client";

import React from "react";
import { useFichaSocialForm } from "../FormContextWrapper";
import InputField from "@/components/InputField";

export default function SituacionEconomicaTab() {
  const { formData, updateFormData, updateNestedField } = useFichaSocialForm();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE').format(value || 0);
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Situación Económica</h3>

      {/* Ingresos */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-green-900 dark:text-green-100 mb-4">Ingresos Mensuales</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            id="ingreso_trabajador"
            label="Ingreso del Trabajador"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.ingresos?.trabajador || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.ingresos.trabajador", value);
            }}
            placeholder="S/. 0.00"
          />
          <InputField
            id="ingreso_conyuge"
            label="Ingreso del Cónyuge"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.ingresos?.conyuge || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.ingresos.conyuge", value);
            }}
            placeholder="S/. 0.00"
          />
          <InputField
            id="ingreso_otros"
            label="Otros Ingresos"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.ingresos?.otros || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.ingresos.otros", value);
            }}
            placeholder="S/. 0.00"
          />
        </div>
      </div>

      {/* Egresos - Servicios Básicos */}
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-red-900 dark:text-red-100 mb-4">Egresos Mensuales - Servicios Básicos</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            id="egreso_agua"
            label="Agua"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.egresos?.servicios_basicos?.agua || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.egresos.servicios_basicos.agua", value);
            }}
            placeholder="S/. 0.00"
          />
          <InputField
            id="egreso_luz"
            label="Luz"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.egresos?.servicios_basicos?.luz || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.egresos.servicios_basicos.luz", value);
            }}
            placeholder="S/. 0.00"
          />
          <InputField
            id="egreso_telefono"
            label="Teléfono"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.egresos?.servicios_basicos?.telefono || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.egresos.servicios_basicos.telefono", value);
            }}
            placeholder="S/. 0.00"
          />
          <InputField
            id="egreso_internet"
            label="Internet"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.egresos?.servicios_basicos?.internet || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.egresos.servicios_basicos.internet", value);
            }}
            placeholder="S/. 0.00"
          />
          <InputField
            id="egreso_cable"
            label="Cable"
            type="text"
            value={`S/. ${formatCurrency(formData.datos_economicos?.egresos?.servicios_basicos?.cable || 0)}`}
            onChange={(e) => {
              const value = parseCurrency(e.target.value);
              updateNestedField("datos_economicos.egresos.servicios_basicos.cable", value);
            }}
            placeholder="S/. 0.00"
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">Resumen Económico</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Ingresos</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              S/. {formatCurrency(
                (formData.datos_economicos?.ingresos?.trabajador || 0) +
                (formData.datos_economicos?.ingresos?.conyuge || 0) +
                (formData.datos_economicos?.ingresos?.otros || 0)
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Egresos</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              S/. {formatCurrency(
                Object.values(formData.datos_economicos?.egresos?.servicios_basicos || {}).reduce((sum: number, val: any) => sum + (val || 0), 0)
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Balance</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              S/. {formatCurrency(
                (formData.datos_economicos?.ingresos?.trabajador || 0) +
                (formData.datos_economicos?.ingresos?.conyuge || 0) +
                (formData.datos_economicos?.ingresos?.otros || 0) -
                Object.values(formData.datos_economicos?.egresos?.servicios_basicos || {}).reduce((sum: number, val: any) => sum + (val || 0), 0)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}