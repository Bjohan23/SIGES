// components/InputField.tsx
// Single Responsibility: Campo de entrada reutilizable

import { ChangeEvent, ReactNode } from 'react'

interface InputFieldProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  icon?: ReactNode
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  min?: number
  max?: number
  maxLength?: number
  step?: string
  pattern?: string
}

export default function InputField({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  icon,
  required = true,
  disabled = false,
  readOnly = false,
  min,
  max,
  maxLength,
  step,
  pattern,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          maxLength={maxLength}
          step={step}
          pattern={pattern}
          className={`block w-full ${
            icon ? 'pl-10' : 'pl-3'
          } pr-3 py-3 border ${
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
            disabled || readOnly ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}
