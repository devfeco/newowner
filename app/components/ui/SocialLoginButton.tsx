'use client'

import { theme } from '@/app/theme'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'linkedin'
  icon: ReactNode
  text: string
}

export const SocialLoginButton = ({
  provider,
  icon,
  text,
  className = '',
  ...props
}: SocialLoginButtonProps) => {
  const providerColors = {
    google: theme.colors.social.google,
    linkedin: theme.colors.social.linkedin
  }

  return (
    <button
      className={`
        flex items-center justify-center w-full py-2.5 px-4 
        border border-gray-200 rounded-lg hover:bg-gray-50 
        transition-colors focus:outline-none focus:ring-1
        focus:ring-offset-1 mb-3 ${className}
      `}
      style={{ 
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.background.light,
        borderRadius: '8px',
      }}
      {...props}
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  )
} 