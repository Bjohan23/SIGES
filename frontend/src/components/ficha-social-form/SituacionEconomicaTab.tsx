'use client'

import React, { useMemo } from 'react'
import { useFichaSocialForm } from '@/context/FichaSocialFormContext'
import InputField from '@/components/InputField'

export default function SituacionEconomicaTab() {
  const { formData, updateNestedField } = useFichaSocialForm()

  // Calcular totales automáticamente
  const totales = useMemo(() => {
    const { ingresos, egresos } = formData.datos_economicos

    const totalIngresos = (ingresos.trabajador || 0) + (ingresos.conyuge || 0) + (ingresos.otros || 0)

    const totalServiciosBasicos = Object.values(egresos.servicios_basicos).reduce((sum, val) => sum + (val || 0), 0)
    const totalGastosFamiliares = Object.values(egresos.gastos_familiares).reduce((sum, val) => sum + (val || 0), 0)
    const totalDeudasSeguros = Object.values(egresos.deudas_seguros).reduce((sum, val) => sum + (val || 0), 0)

    const totalEgresos = totalServiciosBasicos + totalGastosFamiliares + totalDeudasSeguros

    const balance = totalIngresos - totalEgresos

    return {
      totalIngresos,
      totalServiciosBasicos,
      totalGastosFamiliares,
      totalDeudasSeguros,
      totalEgresos,
      balance
    }
  }, [formData.datos_economicos])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Situación Económica</h3>

      {/* Ingresos */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-green-900 mb-4">Ingresos Mensuales</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            id="ingresos_trabajador"
            label="Ingreso del Trabajador (S/)"
            type="number"
            value={formData.datos_economicos.ingresos.trabajador.toString()}
            onChange={(e) => updateNestedField('datos_economicos.ingresos.trabajador', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="ingresos_conyuge"
            label="Ingreso del Cónyuge (S/)"
            type="number"
            value={formData.datos_economicos.ingresos.conyuge.toString()}
            onChange={(e) => updateNestedField('datos_economicos.ingresos.conyuge', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="ingresos_otros"
            label="Otros Ingresos (S/)"
            type="number"
            value={formData.datos_economicos.ingresos.otros.toString()}
            onChange={(e) => updateNestedField('datos_economicos.ingresos.otros', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />
        </div>

        <div className="mt-4 p-3 bg-green-100 rounded-md">
          <p className="text-sm font-semibold text-green-900">
            Total Ingresos: {formatCurrency(totales.totalIngresos)}
          </p>
        </div>
      </div>

      {/* Egresos - Servicios Básicos */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium text-red-900 mb-4">Egresos Mensuales</h4>

        <h5 className="text-md font-medium text-gray-700 mb-3">Servicios Básicos</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <InputField
            id="egresos_agua"
            label="Agua (S/)"
            type="number"
            value={formData.datos_economicos.egresos.servicios_basicos.agua.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.servicios_basicos.agua', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_luz"
            label="Luz (S/)"
            type="number"
            value={formData.datos_economicos.egresos.servicios_basicos.luz.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.servicios_basicos.luz', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_telefono"
            label="Teléfono (S/)"
            type="number"
            value={formData.datos_economicos.egresos.servicios_basicos.telefono.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.servicios_basicos.telefono', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_internet"
            label="Internet (S/)"
            type="number"
            value={formData.datos_economicos.egresos.servicios_basicos.internet.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.servicios_basicos.internet', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_cable"
            label="Cable/TV (S/)"
            type="number"
            value={formData.datos_economicos.egresos.servicios_basicos.cable.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.servicios_basicos.cable', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />
        </div>

        <div className="p-2 bg-red-100 rounded-md mb-4">
          <p className="text-sm font-medium text-red-900">
            Subtotal Servicios Básicos: {formatCurrency(totales.totalServiciosBasicos)}
          </p>
        </div>

        {/* Gastos Familiares */}
        <h5 className="text-md font-medium text-gray-700 mb-3">Gastos Familiares</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <InputField
            id="egresos_alimentacion"
            label="Alimentación (S/)"
            type="number"
            value={formData.datos_economicos.egresos.gastos_familiares.alimentacion.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.gastos_familiares.alimentacion', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_educacion"
            label="Educación (S/)"
            type="number"
            value={formData.datos_economicos.egresos.gastos_familiares.educacion.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.gastos_familiares.educacion', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_salud"
            label="Salud (S/)"
            type="number"
            value={formData.datos_economicos.egresos.gastos_familiares.salud.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.gastos_familiares.salud', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_transporte"
            label="Transporte (S/)"
            type="number"
            value={formData.datos_economicos.egresos.gastos_familiares.transporte.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.gastos_familiares.transporte', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_vestimenta"
            label="Vestimenta (S/)"
            type="number"
            value={formData.datos_economicos.egresos.gastos_familiares.vestimenta.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.gastos_familiares.vestimenta', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />
        </div>

        <div className="p-2 bg-red-100 rounded-md mb-4">
          <p className="text-sm font-medium text-red-900">
            Subtotal Gastos Familiares: {formatCurrency(totales.totalGastosFamiliares)}
          </p>
        </div>

        {/* Deudas y Seguros */}
        <h5 className="text-md font-medium text-gray-700 mb-3">Deudas y Seguros</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputField
            id="egresos_prestamos"
            label="Préstamos/Deudas (S/)"
            type="number"
            value={formData.datos_economicos.egresos.deudas_seguros.prestamos.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.deudas_seguros.prestamos', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />

          <InputField
            id="egresos_seguros"
            label="Seguros (S/)"
            type="number"
            value={formData.datos_economicos.egresos.deudas_seguros.seguros.toString()}
            onChange={(e) => updateNestedField('datos_economicos.egresos.deudas_seguros.seguros', parseFloat(e.target.value) || 0)}
            min={0}
            step="0.01"
          />
        </div>

        <div className="p-2 bg-red-100 rounded-md">
          <p className="text-sm font-medium text-red-900">
            Subtotal Deudas y Seguros: {formatCurrency(totales.totalDeudasSeguros)}
          </p>
        </div>

        <div className="mt-4 p-3 bg-red-200 rounded-md">
          <p className="text-sm font-semibold text-red-900">
            Total Egresos: {formatCurrency(totales.totalEgresos)}
          </p>
        </div>
      </div>

      {/* Balance */}
      <div className={`p-4 rounded-lg ${totales.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
        <h4 className="text-lg font-medium mb-2">Balance Mensual</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Ingresos</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(totales.totalIngresos)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Egresos</p>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(totales.totalEgresos)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className={`text-lg font-bold ${totales.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(totales.balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
