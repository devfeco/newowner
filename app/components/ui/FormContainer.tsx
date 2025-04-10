'use client'

import { theme } from '@/app/theme'
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GoogleIcon, LinkedinIcon } from '@/app/components/icons'

interface FormContainerProps {
  children: ReactNode
  title: string
  subtitle?: string
  alternateActionText?: string
  alternateActionLink?: string
  showSocialLogin?: boolean
  showVideo?: boolean
  videoId?: string
}

interface SocialIconButtonProps {
  icon: ReactNode
  label: string
  onClick: () => void
}

const SocialIconButton = ({ icon, label, onClick }: SocialIconButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      aria-label={label}
    >
      {icon}
    </button>
  )
}

export const FormContainer = ({
  children,
  title,
  subtitle,
  alternateActionText,
  alternateActionLink,
  showSocialLogin = true,
  showVideo = false,
  videoId = "roQK7fJ1AKo" // Varsayılan video ID
}: FormContainerProps) => {
  const splitText = alternateActionText ? alternateActionText.split(' ') : [];
  const linkText = splitText.length >= 2 ? `${splitText[splitText.length - 2]} ${splitText[splitText.length - 1]}` : '';
  const normalText = splitText.length >= 2 ? splitText.slice(0, splitText.length - 2).join(' ') : '';
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sol Panel - Logo ve slogan veya Video (Mobil ekranlarda) */}
      <div className={`flex md:hidden ${showVideo ? 'flex-col p-0' : 'p-6'} bg-gradient-to-r from-[#1e70f9] to-[#29ADB2] text-white`}>
        {showVideo ? (
          <div className="flex flex-col items-center justify-center w-full p-4">
            <Image 
              src="/images/newowner-logo-white.png"
              alt="NewOwner Logo"
              width={150}
              height={48}
              priority
              className="mb-2"
            />
            <p className="text-xs opacity-80 mb-3">E-Ticaret'e başlamanın hızlı yolu</p>
            
            <div className="w-full shadow-md rounded-lg overflow-hidden border-2 border-white/20">
              <div className="relative pb-[56.25%] h-0">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <Image 
              src="/images/newowner-logo-white.png"
              alt="NewOwner Logo"
              width={180}
              height={60}
              priority
              className="mb-2"
            />
            <p className="text-sm opacity-80">E-Ticaret'e başlamanın hızlı yolu</p>
          </div>
        )}
      </div>
      
      {/* Sol Panel - Gradient veya Video (Sadece tablet ve masaüstü) */}
      <div 
        className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #1e70f9 0%, #29ADB2 100%)',
          color: 'white'
        }}
      >
        {/* Dekoratif daire efektleri */}
        <div className="absolute top-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full opacity-10 bg-white"></div>
        <div className="absolute bottom-[-180px] right-[-180px] w-[400px] h-[400px] rounded-full opacity-10 bg-white"></div>
        
        {showVideo ? (
          <div className="w-full h-full flex flex-col items-center justify-center z-10 px-8">
          <Image 
              src="/images/newowner-logo-white.png"
              alt="NewOwner Logo"
              width={300}
              height={95}
              priority
              className="mb-3"
            />
            <p className="text-lg opacity-80 mb-10">E-Ticaret'e başlamanın hızlı yolu</p>
            <div className="w-full max-w-xl shadow-2xl rounded-xl overflow-hidden mb-8 border-4 border-white/20">
              <div className="relative pb-[56.25%] h-0">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Image 
              src="/images/newowner-logo-white.png"
              alt="NewOwner Logo"
              width={300}
              height={95}
              priority
              className="mb-3"
            />
            <p className="text-lg opacity-80">E-Ticaret'e başlamanın hızlı yolu</p>
          </div>
        )}
      </div>
      
      {/* Sağ Panel - Form */}
      <div 
        className={`w-full md:w-1/2 p-4 sm:p-6 flex items-center justify-center flex-grow ${showVideo ? 'pt-6' : ''}`}
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="w-full max-w-md">
          
          <div className="rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
            <div className="mb-6 text-center">
              <Image 
                src="/images/newowner-logo.png"
                alt="NewOwner Logo"
                width={120}
                height={32}
                className="mx-auto mb-6 md:w-[140px] md:h-auto"
                priority
              />
              <h1 
                className="text-xl font-bold mb-2"
                style={{ color: theme.colors.text.primary }}
              >
                {title}
              </h1>
              {subtitle && (
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            
            {children}
            
            {/* Sosyal medya butonları */}
            {showSocialLogin && (
              <div className="mt-5">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">veya</span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-4">
                  <SocialIconButton 
                    icon={<GoogleIcon />} 
                    label="Google ile giriş yap" 
                    onClick={() => console.log('Google login')}
                  />
                  <SocialIconButton 
                    icon={<LinkedinIcon />} 
                    label="LinkedIn ile giriş yap" 
                    onClick={() => console.log('LinkedIn login')}
                  />
                </div>
              </div>
            )}
          </div>
          
          {alternateActionText && alternateActionLink && (
            <div className="mt-4 sm:mt-5 text-center">
              <p 
                className="text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                {normalText}{normalText ? ' ' : ''}
                <Link 
                  href={alternateActionLink}
                  className="font-medium hover:underline"
                  style={{ color: theme.colors.primary.main }}
                >
                  {linkText}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 