'use client'

import React, { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { FormContainer } from '@/app/components/ui/FormContainer'
import { Checkbox } from '@/app/components/ui/Checkbox'
import { TermsModal } from '@/app/components/TermsModal'
import { signIn } from 'next-auth/react'
import { GoogleIcon, LinkedinIcon } from '@/app/components/icons'
import logo from "@/public/images/newowner-logo.png"


export default function RegisterPage() {
  const router = useRouter()
  const { register, state, loginWithGoogle } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
    general: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setFormErrors({ ...formErrors, [name]: '', general: '' })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...formErrors }

    // Ad kontrolü
    if (!formData.name.trim()) {
      newErrors.name = 'Ad alanı gereklidir'
      valid = false
    }

    // Email kontrolü
    if (!formData.email) {
      newErrors.email = 'Email gereklidir'
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz'
      valid = false
    }

    // Şifre kontrolü
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir'
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır'
      valid = false
    }

    // Şifre tekrar kontrolü
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir'
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
      valid = false
    }

    // Üyelik sözleşmesi kontrolü
    if (!acceptTerms) {
      newErrors.terms = 'Üyelik sözleşmesini kabul etmelisiniz'
      valid = false
    }

    setFormErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setFormErrors({ ...formErrors, general: '' })

    try {
      const result = await register(formData.name, formData.email, formData.password)
      console.log('Kayıt başarılı, sonuç:', result)
      
      // Başarılı kayıt sonrası API'den gelen response'a göre yönlendirme yap
      if (result && result.user) {
        console.log('Onboarding sayfasına yönlendiriliyor...')
        router.push('/onboarding')
      } else {
        console.warn('Kayıt başarılı ama kullanıcı verisi eksik')
        router.push('/onboarding') 
      }
    } catch (error: any) {
      console.error('Kayıt hatası:', error)
      setFormErrors({
        ...formErrors,
        general: error.message || 'Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin.'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleRegister = async () => {
    try {
      setIsGoogleLoading(true)
      setFormErrors({ ...formErrors, general: '' })
      
      console.log('Google kayıt başlatılıyor - doğrudan yönlendirme')
      
      // Doğrudan callback URL'e yönlendir
      await signIn('google', { 
        callbackUrl: '/auth/google-handler',
        redirect: true
      })
      
    } catch (error: any) {
      console.error('Google kayıt hatası:', error)
      setFormErrors({
        ...formErrors,
        general: error.message || 'Google ile kayıt yapılamadı. Lütfen tekrar deneyin.'
      })
      setIsGoogleLoading(false)
    }
  }

  const handleLinkedinRegister = async () => {
    try {
      setIsLoading(true)
      setFormErrors({ ...formErrors, general: '' })
      
      console.log('LinkedIn kayıt başlatılıyor - doğrudan yönlendirme')
      
      // LinkedIn ile kayıt için NextAuth'u kullan
      await signIn('linkedin', { 
        callbackUrl: '/auth/linkedin-handler',
        redirect: true
      })
      
    } catch (error: any) {
      console.error('LinkedIn kayıt hatası:', error)
      setFormErrors({
        ...formErrors,
        general: error.message || 'LinkedIn ile kayıt yapılamadı. Lütfen tekrar deneyin.'
      })
      setIsLoading(false)
    }
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
  
  return (
    <FormContainer
      title="KAYIT OL"
      subtitle="Yeni hesap oluştur"
      alternateActionText="Hesabınız var mı? Giriş Yap"
      alternateActionLink="/auth/login"
    >
      <div className="flex flex-col items-center justify-center w-full">
        {formErrors.general && (
          <div className="w-full mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs sm:text-sm">
            {formErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-3 sm:space-y-4">
          <Input
            icon={<div />}
            type="text"
            placeholder="Adınız"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
          />

          <Input
            icon={<div />}
            type="email"
            placeholder="Email adresiniz"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
          />

          <Input
            icon={<div />}
            type="password"
            placeholder="Şifre"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
          />

          <Input
            icon={<div />}
            type="password"
            placeholder="Şifre Tekrar"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={formErrors.confirmPassword}
          />

          <div className="mb-2 sm:mb-4">
            <Checkbox
              label={
                <span className="text-xs sm:text-sm">
                  <button 
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer font-medium text-black hover:underline"
                  >
                    Üyelik Sözleşmesi
                  </button>
                  'ni okudum ve kabul ediyorum
                </span>
              }
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            {formErrors.terms && (
              <p className="mt-1 text-xs text-red-600">{formErrors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            className="mt-2 sm:mt-4"
          >
            {isLoading ? 'Kaydınız Yapılıyor...' : 'Kayıt Ol'}
          </Button>
          
          <div className="relative mt-2 sm:mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">veya</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
                  <SocialIconButton 
                    icon={<GoogleIcon />} 
                    label="Google ile kayıt ol" 
                    onClick={handleGoogleRegister}
                  />
                  <SocialIconButton 
                    icon={<LinkedinIcon />} 
                    label="LinkedIn ile kayıt ol" 
                    onClick={handleLinkedinRegister}
                  />
                </div>
        </form>
      </div>

      <TermsModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </FormContainer>
  )
} 