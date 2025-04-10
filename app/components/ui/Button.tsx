'use client'

import { theme } from '@/app/theme'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  ...props
}: ButtonProps) => {
  const variantStyles = {
    primary: {
      background: theme.colors.primary.main,
      color: '#FFFFFF',
      hover: { background: theme.colors.primary.dark },
    },
    secondary: {
      background: theme.colors.secondary.main,
      color: '#FFFFFF',
      hover: { background: theme.colors.secondary.main + 'DD' },
    },
    outline: {
      background: 'transparent',
      color: theme.colors.primary.main,
      border: `1px solid ${theme.colors.primary.main}`,
      hover: { background: theme.colors.primary.light },
    },
    text: {
      background: 'transparent',
      color: theme.colors.primary.main,
      hover: { background: theme.colors.primary.light },
    },
    destructive: {
      background: '#E53E3E', // Kırmızı renk
      color: '#FFFFFF',
      hover: { background: '#C53030' }, // Koyu kırmızı
    },
  }

  const sizeStyles = {
    sm: { padding: '0.375rem 0.75rem', fontSize: theme.fontSizes.sm },
    md: { padding: '0.625rem 0', fontSize: theme.fontSizes.md },
    lg: { padding: '0.875rem 0', fontSize: theme.fontSizes.lg },
  }

  const style = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    transition: 'all 150ms ease',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  }

  return (
    <button
      style={style}
      className={`relative ${className}`}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      <span className={loading ? 'invisible' : 'flex items-center gap-2'}>
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </button>
  )
} 