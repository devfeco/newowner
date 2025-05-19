'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/app/components/ui/Button'
import { FormContainer } from '@/app/components/ui/FormContainer'

export default function OnboardingPage() {
  const router = useRouter()
  const { state, updateUserType, sendPhoneOTP, verifyPhoneOTP } = useAuth()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'phone' | 'otp' | 'userType'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  // Kullanıcı girişi yapılmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      console.log('Kullanıcı girişi yapılmamış, login sayfasına yönlendiriliyor')
      router.push('/auth/login')
    }
  }, [state.isLoading, state.isAuthenticated, router])

  // OTP geri sayım sayacı
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [otpCountdown])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhoneNumber(value)
    setPhoneError('')
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOtp(value)
    setOtpError('')
  }

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setPhoneError('Telefon numarası gereklidir')
      return
    }

    // Basit telefon numarası doğrulama
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('Geçerli bir telefon numarası girin (05XX XXX XX XX)')
      return
    }

    setIsLoading(true)

    try {
      await sendPhoneOTP(phoneNumber)
      setOtpSent(true)
      setCurrentStep('otp')
      setOtpCountdown(300) // 5 dakika (300 saniye)
    } catch (error: any) {
      setPhoneError(error.message || 'OTP gönderilirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setOtpError('Doğrulama kodu gereklidir')
      return
    }

    setIsLoading(true)

    try {
      await verifyPhoneOTP(phoneNumber, otp)
      setCurrentStep('userType')
    } catch (error: any) {
      setOtpError(error.message || 'Doğrulama kodu doğrulanamadı')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectType = (type: string) => {
    setSelectedType(type)
  }

  const handleContinue = async () => {
    if (!selectedType) return

    setIsLoading(true)

    try {
      // Kullanıcı tipini kaydetme işlemi
      console.log('Seçilen kullanıcı tipi:', selectedType)
      
      // AuthContext aracılığıyla kullanıcı tipini güncelle
      await updateUserType(selectedType as 'buyer' | 'seller')
      
      // Kullanıcı tipine göre farklı sayfaya yönlendir
      if (selectedType === 'buyer') {
        // Alıcı ise ana sayfaya yönlendir
        console.log('Alıcı seçildi, ana sayfaya yönlendiriliyor...')
        router.push('/')
      } else if (selectedType === 'seller') {
        // Satıcı ise ilan oluşturma sayfasına yönlendir
        console.log('Satıcı seçildi, ilan oluşturma sayfasına yönlendiriliyor...')
        router.push('/listings/create')
      }
    } catch (error: any) {
      console.error('Kullanıcı tipi kaydedilirken hata oluştu:', error)
      alert('Hata: ' + (error.message || 'Kullanıcı tipi güncellenemedi'))
    } finally {
      setIsLoading(false)
    }
  }

  // Sayfa yüklenirken kullanıcı girişi kontrolü yapılıyor
  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Telefon numarası girişi adımı
  if (currentStep === 'phone') {
    return (
      <FormContainer
        title="TELEFON DOĞRULAMA"
        subtitle="Lütfen telefon numaranızı girin"
        showSocialLogin={false}
      >
        <div className="flex flex-col items-center justify-center w-full space-y-3 sm:space-y-6">
          <div className="w-full text-center mb-1 sm:mb-4">
            <p className="text-gray-600 text-xs sm:text-sm">
              Hesabınızı doğrulamak için telefon numaranıza bir kod göndereceğiz.
            </p>
          </div>

          <div className="w-full">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon Numarası
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="05XX XXX XX XX"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          <Button
            onClick={handleSendOTP}
            loading={isLoading}
            fullWidth
            className="mt-1 sm:mt-4"
          >
            Kod Gönder
          </Button>
        </div>
      </FormContainer>
    )
  }

  // OTP doğrulama adımı
  if (currentStep === 'otp') {
    return (
      <FormContainer
        title="TELEFON DOĞRULAMA"
        subtitle="Doğrulama kodunu girin"
        showSocialLogin={false}
      >
        <div className="flex flex-col items-center justify-center w-full space-y-3 sm:space-y-6">
          <div className="w-full text-center mb-1 sm:mb-4">
            <p className="text-gray-600 text-xs sm:text-sm">
              {phoneNumber} numaralı telefonunuza gönderilen 6 haneli kodu girin.
            </p>
            {otpCountdown > 0 && (
              <p className="text-gray-500 text-xs mt-2">
                Kod geçerlilik süresi: {Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Doğrulama Kodu
            </label>
            <input
              id="otp"
              type="text"
              placeholder="6 haneli kod"
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
            {otpError && (
              <p className="text-red-500 text-xs mt-1">{otpError}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-2">
            <Button
              onClick={handleVerifyOTP}
              loading={isLoading}
              fullWidth
              className="mt-1 sm:mt-4"
            >
              Doğrula
            </Button>

            <Button
              onClick={handleSendOTP}
              disabled={otpCountdown > 0 || isLoading}
              variant="secondary"
              fullWidth
              className="mt-1 sm:mt-4"
            >
              {otpCountdown > 0 ? `Yeniden Gönder (${Math.floor(otpCountdown / 60)}:${(otpCountdown % 60).toString().padStart(2, '0')})` : 'Yeniden Gönder'}
            </Button>
          </div>

          <div className="w-full text-center">
            <button
              onClick={() => setCurrentStep('phone')}
              className="text-blue-500 text-sm hover:underline"
            >
              Telefon numarasını değiştir
            </button>
          </div>
        </div>
      </FormContainer>
    )
  }

  // Kullanıcı tipi seçme adımı
  return (
    <FormContainer
      title="HOŞ GELDİNİZ"
      subtitle="Lütfen kullanıcı tipinizi seçin"
      showSocialLogin={false}
      showVideo={true}
      videoId="roQK7fJ1AKo" // E-ticaret sistemleri hakkında bir video ID
    >
      <div className="flex flex-col items-center justify-center w-full space-y-3 sm:space-y-6">
        <div className="w-full text-center mb-1 sm:mb-4">
          <p className="text-gray-600 text-xs sm:text-sm">
            Platformumuzu nasıl kullanmak istediğinizi seçin. Bu seçim daha sonra profil ayarlarınızdan değiştirilebilir.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">
          <div 
            className={`flex-1 p-3 sm:p-6 border rounded-lg cursor-pointer transition-all ${
              selectedType === 'buyer' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleSelectType('buyer')}
          >
            <h3 className="text-base sm:text-lg font-medium mb-0.5 sm:mb-2 text-black">Alıcı</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              E-Ticaret sistemi satın almak istiyorum.
            </p>
          </div>

          <div 
            className={`flex-1 p-3 sm:p-6 border rounded-lg cursor-pointer transition-all ${
              selectedType === 'seller' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleSelectType('seller')}
          >
            <h3 className="text-base sm:text-lg font-medium mb-0.5 sm:mb-2 text-black">Satıcı</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              E-Ticaret sistemimi satışa çıkarmak istiyorum.
            </p>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          loading={isLoading}
          fullWidth
          className="mt-1 sm:mt-4"
        >
          Devam Et
        </Button>
      </div>
    </FormContainer>
  )
} 