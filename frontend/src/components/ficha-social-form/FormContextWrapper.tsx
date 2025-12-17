"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Definir el tipo del contexto
interface EditFormContextType {
  formData: any;
  errors: any;
  updateFormData: (field: string, value: any) => void;
  updateNestedField: (path: string, value: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  validateStep: (step: number) => boolean;
  getProgress: () => number;
  canProceed: () => boolean;
  resetForm: () => void;
}

// Crear el contexto
const EditFormContext = createContext<EditFormContextType | undefined>(undefined);

interface FormContextWrapperProps {
  formData: any;
  onChange: (newData: any) => void;
  children: ReactNode;
}

export function FormContextWrapper({ formData, onChange, children }: FormContextWrapperProps) {
  const updateFormData = (field: string, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const updateNestedField = (path: string, value: any) => {
    const keys = path.split('.');
    const newFormData = { ...formData };
    let current: any = newFormData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    onChange(newFormData);
  };

  // Simular las funciones del contexto original
  const contextValue: EditFormContextType = {
    formData,
    errors: {}, // Simplificado para edición
    updateFormData,
    updateNestedField,
    currentStep: 0,
    setCurrentStep: () => {},
    validateStep: () => true,
    getProgress: () => 100,
    canProceed: () => true,
    resetForm: () => {},
  };

  return (
    <EditFormContext.Provider value={contextValue}>
      {children}
    </EditFormContext.Provider>
  );
}

// Hook personalizado para usar el contexto en modo edición
export function useFichaSocialForm() {
  const context = useContext(EditFormContext);
  if (context === undefined) {
    throw new Error("useFichaSocialForm must be used within a FormContextWrapper");
  }
  return context;
}