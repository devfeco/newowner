'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/app/components/ui/Button'
import { FormContainer } from '@/app/components/ui/FormContainer'

export default function OnboardingPage() {
  const router = useRouter()
  const { state, updateUserType } = useAuth()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Kullanıcı girişi yapılmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      console.log('Kullanıcı girişi yapılmamış, login sayfasına yönlendiriliyor')
      router.push('/auth/login')
    }
  }, [state.isLoading, state.isAuthenticated, router])

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <FormContainer
      title="HOŞ GELDİNİZ"
      subtitle="Lütfen kullanıcı tipinizi seçin"
      showSocialLogin={false}
      showVideo={true}
      videoId="roQK7fJ1AKo" // E-ticaret sistemleri hakkında bir video ID
    >
      <div className="flex flex-col items-center justify-center w-full space-y-6">
        <div className="w-full text-center mb-4">
          <p className="text-gray-600">
            Platformumuzu nasıl kullanmak istediğinizi seçin. Bu seçim daha sonra profil ayarlarınızdan değiştirilebilir.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div 
            className={`flex-1 p-6 border rounded-lg cursor-pointer transition-all ${
              selectedType === 'buyer' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleSelectType('buyer')}
          >
            <h3 className="text-lg font-medium mb-2 text-black">Alıcı</h3>
            <p className="text-sm text-gray-600">
              E-Ticaret sistemi satın almak istiyorum.
            </p>
          </div>

          <div 
            className={`flex-1 p-6 border rounded-lg cursor-pointer transition-all ${
              selectedType === 'seller' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleSelectType('seller')}
          >
            <h3 className="text-lg font-medium mb-2 text-black">Satıcı</h3>
            <p className="text-sm text-gray-600">
              E-Ticaret sistemimi satın almak istiyorum.
            </p>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          loading={isLoading}
          fullWidth
        >
          Devam Et
        </Button>
      </div>
    </FormContainer>
  )
} 