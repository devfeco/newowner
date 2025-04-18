'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processGoogleLogin = async () => {
      try {
        // Oturum doğrulandıysa ve kullanıcı bilgileri varsa
        if (status === 'authenticated' && session?.user?.email) {
          // JWT token almak için API'ye istek at
          const response = await fetch('/api/auth/google-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          })
          
          const data = await response.json()
          
          if (!data.success) {
            throw new Error(data.message || 'Token oluşturulamadı')
          }
          
          // Token'ı localStorage'a kaydet
          if (data.token) {
            localStorage.setItem('token', data.token)
            console.log('Google kullanıcısı için token kaydedildi')
            
            // Kullanıcının tipine göre yönlendirme yap
            if (data.user.userType) {
              console.log('Kullanıcı tipi mevcut, ana sayfaya yönlendiriliyor...')
              router.push('/')
            } else {
              console.log('Kullanıcı tipi belirlenmemiş, onboarding sayfasına yönlendiriliyor...')
              router.push('/onboarding')
            }
          } else {
            throw new Error('Token alınamadı')
          }
        } else if (status === 'unauthenticated') {
          // Oturum doğrulanmadıysa login sayfasına yönlendir
          router.push('/auth/login')
        }
      } catch (error: any) {
        console.error('Google login işleme hatası:', error)
        setError(error.message || 'Giriş işlemi sırasında bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    processGoogleLogin()
  }, [session, status, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Google ile giriş işleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Giriş Hatası</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    )
  }

  return null
} 