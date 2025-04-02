'use client'

import { theme } from '@/app/theme'
import { useState, InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  label?: string
  error?: string
}

export const Input = ({ 
  icon, 
  label, 
  error, 
  className = '', 
  type = 'text', 
  ...props 
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="mb-4">
      {label && (
        <label 
          className="block text-sm font-medium mb-1.5" 
          style={{ color: theme.colors.text.secondary }}
        >
          {label}
        </label>
      )}
      
      <div 
        className={`
          flex items-center w-full rounded-lg px-4 py-3 transition-all
          ${error ? 'border-red-500' : isFocused 
            ? `border border-${theme.colors.primary.main}` 
            : 'border border-gray-200'}
          ${className}
        `}
        style={{ 
          backgroundColor: theme.colors.background.light,
          boxShadow: isFocused ? 'none' : 'none',
          borderRadius: '8px'
        }}
      >
        {icon && (
          <div className="flex items-center justify-center mr-3 text-gray-400">
            {icon}
          </div>
        )}
        
        <input 
          type={type}
          className="w-full bg-transparent outline-none text-sm"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ color: theme.colors.text.primary }}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
} 