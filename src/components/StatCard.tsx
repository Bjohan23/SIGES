// components/StatCard.tsx
// Single Responsibility: Tarjeta de estadística reutilizable

import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  trend?: string
  iconBgColor?: string
  iconColor?: string
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
}: StatCardProps) {
  // Mapear colores claros a oscuros
  const darkBgMap: { [key: string]: string } = {
    'bg-blue-100': 'dark:bg-blue-900/30',
    'bg-green-100': 'dark:bg-green-900/30',
    'bg-yellow-100': 'dark:bg-yellow-900/30',
    'bg-red-100': 'dark:bg-red-900/30',
    'bg-purple-100': 'dark:bg-purple-900/30',
    'bg-teal-100': 'dark:bg-teal-900/30',
    'bg-indigo-100': 'dark:bg-indigo-900/30',
  }

  const darkColorMap: { [key: string]: string } = {
    'text-blue-600': 'dark:text-blue-400',
    'text-green-600': 'dark:text-green-400',
    'text-yellow-600': 'dark:text-yellow-400',
    'text-red-600': 'dark:text-red-400',
    'text-purple-600': 'dark:text-purple-400',
    'text-teal-600': 'dark:text-teal-400',
    'text-indigo-600': 'dark:text-indigo-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 hover:shadow-lg dark:hover:shadow-gray-900 transition border border-transparent dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
        </div>
        <div
          className={`w-12 h-12 ${iconBgColor} ${darkBgMap[iconBgColor] || ''} rounded-lg flex items-center justify-center transition-colors`}
        >
          <div className={`w-6 h-6 ${iconColor} ${darkColorMap[iconColor] || ''} transition-colors`}>{icon}</div>
        </div>
      </div>
      {trend && <p className="text-xs text-green-600 dark:text-green-400 mt-4">{trend}</p>}
    </div>
  )
}
