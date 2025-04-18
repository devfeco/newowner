'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function LinkedInHandlerPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [message, setMessage] = useState('LinkedIn ile giriş işleniyor...')
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const processLinkedInAuth = async () => {
      try {
        console.log('LinkedIn handler sayfası yüklendi')
        console.log('Session durumu:', status)
        console.log('Session email:', session?.user?.email)
        
        if (status === 'loading') {
          setMessage('Oturum bilgileri kontrol ediliyor...')
          return // Session yüklenmeyi bekle
        }
        
        if (status === 'unauthenticated') {
          setError('Oturum açılamadı')
          return
        }
        
        if (!session?.user?.email) {
          setError('Kullanıcı email bilgisi alınamadı')
          return
        }
        
        // Email bilgisi ile token al
        const email = session.user.email
        setMessage(`${email} için token alınıyor...`)
        
        const response = await fetch(`/api/auth/session-token?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        
        if (!data.success) {
          setError(`Token alınamadı: ${data.message}`)
          return
        }
        
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', data.token)
        console.log(`Token alındı: ${data.token.substring(0, 15)}...`)
        
        // Kullanıcı tipine göre yönlendirme yap
        if (data.user.userType) {
          setMessage('Ana sayfaya yönlendiriliyorsunuz...')
          console.log('Kullanıcı tipine göre ana sayfaya yönlendiriliyor')
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          setMessage('Onboarding sayfasına yönlendiriliyorsunuz...')
          console.log('Kullanıcı tipine göre onboarding sayfasına yönlendiriliyor')
          setTimeout(() => {
            router.push('/onboarding')
          }, 1000)
        }
      } catch (err: any) {
        console.error('LinkedIn handler hatası:', err)
        setError(err.message || 'Bir hata oluştu')
      }
    }
    
    processLinkedInAuth()
  }, [session, status, router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">LinkedIn Giriş</h1>
        
        {error ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p>{error}</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                Giriş Sayfasına Dön
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
} 