// components/Button.tsx
// Single Responsibility: Botón reutilizable

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition transform active:scale-95'

  const variantClasses = {
    primary: 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 hover:scale-105',
    secondary: 'bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500 dark:focus:ring-gray-400',
    danger: 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-400',
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'
  const widthClasses = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${
        disabled ? disabledClasses : ''
      }`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
