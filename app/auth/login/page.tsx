'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { FormContainer } from '@/app/components/ui/FormContainer'
import { TermsModal } from '@/app/components/TermsModal'

export default function LoginPage() {
  const router = useRouter()
  const { login, state } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    general: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setFormErrors({ ...formErrors, [name]: '', general: '' })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...formErrors }

    if (!formData.email) {
      newErrors.email = 'Email gereklidir'
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz'
      valid = false
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir'
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
      const result = await login(formData.email, formData.password)
      console.log('Login başarılı, sonuç:', result)
      
      // API'den gelen kullanıcı verilerini kullan, state'in güncellenmesini beklememize gerek yok
      if (result && result.user) {
        // API'den doğrudan gelen userType'ı kullan
        const userType = result.user.userType
        
        console.log('Kullanıcı tipi:', userType)
        
        // Kullanıcı tipi belirlenmemişse onboarding sayfasına yönlendir
        if (!userType) {
          console.log('Kullanıcı tipi belirlenmemiş, onboarding sayfasına yönlendiriliyor...')
          router.push('/onboarding')
        } else {
          // Kullanıcı tipi belirlenmiş, ana sayfaya yönlendir
          console.log('Kullanıcı tipi mevcut, ana sayfaya yönlendiriliyor...')
          router.push('/')
        }
      } else {
        // Login başarılı ancak kullanıcı verisi eksik, ana sayfaya yönlendir
        console.warn('Login başarılı ama kullanıcı verisi eksik, ana sayfaya yönlendiriliyor')
        router.push('/')
      }
    } catch (error: any) {
      console.error('Login hatası:', error)
      setFormErrors({
        ...formErrors,
        general: error.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormContainer
      title="GİRİŞ"
      subtitle="Hesabınıza giriş yapın"
      alternateActionText="Hesabınız yok mu? Kayıt Ol"
      alternateActionLink="/auth/register"
    >
      <div className="flex flex-col items-center justify-center w-full">
        {formErrors.general && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {formErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-3 sm:space-y-4">
          <Input
            icon={<div />}
            type="email"
            placeholder="Email adresinizi girin"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            name="email"
          />

          <Input
            icon={<div />}
            type="password"
            placeholder="Şifrenizi girin"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            name="password"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-semibold text-gray-500 hover:text-gray-600">
                Şifremi unuttum
              </a>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            className="mt-3 sm:mt-5"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
      </div>

      <TermsModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </FormContainer>
  )
} 