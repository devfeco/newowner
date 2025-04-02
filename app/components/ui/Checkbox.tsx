'use client'

import { theme } from '@/app/theme'
import { InputHTMLAttributes, ReactNode } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  description?: string
}

export const Checkbox = ({
  label,
  description,
  className = '',
  ...props
}: CheckboxProps) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className="w-4 h-4 rounded cursor-pointer"
          style={{ 
            accentColor: theme.colors.primary.main,
            borderColor: theme.colors.border.main
          }}
          {...props}
        />
      </div>
      <div className="ml-2 text-sm">
        <label 
          className="font-normal select-none cursor-pointer"
          style={{ color: theme.colors.text.primary }}
        >
          {label}
        </label>
        {description && (
          <p 
            className="mt-1 text-xs" 
            style={{ color: theme.colors.text.secondary }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
} 