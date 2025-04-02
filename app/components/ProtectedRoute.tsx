'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireUserType?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireUserType = false
}: ProtectedRouteProps) {
  const router = useRouter()
  const { state } = useAuth()
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    // Yükleniyor durumunu kontrol et
    if (state.isLoading) {
      return
    }
    
    // Auth durumunu kontrol et
    if (!state.isAuthenticated || !state.user) {
      console.log('Kimlik doğrulama başarısız, login sayfasına yönlendiriliyor')
      router.push('/auth/login')
      return
    }
    
    // userType kontrolü gerekiyorsa kontrol et
    if (requireUserType && !state.user.userType) {
      console.log('Kullanıcı tipi belirlenmemiş, onboarding sayfasına yönlendiriliyor')
      router.push('/onboarding')
      return
    }
    
    // Tüm kontroller başarılı
    setIsReady(true)
  }, [state.isLoading, state.isAuthenticated, state.user, router, requireUserType])
  
  // Sayfa yükleniyorsa loading göster
  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  // Kullanıcı durumu onaylandıysa children'ı render et
  if (isReady) {
    return <>{children}</>
  }
  
  // Yönlendirme yapılıyorken boş döndür
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  )
} 