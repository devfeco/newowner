'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

function AuthHandlerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')
  const { data: session, status } = useSession()

  useEffect(() => {
    const error = searchParams.get('error')
    
    if (error) {
      setMessage(`Giriş hatası: ${error}`)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
      return
    }
    
    // Oturum varsa token alma işlemini başlat
    if (status === 'authenticated' && session?.user?.email) {
      setMessage('Giriş başarılı! Yönlendiriliyorsunuz...')
      
      fetch('/api/auth/google-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.token) {
          localStorage.setItem('token', data.token)
          console.log('Token oluşturuldu ve kaydedildi:', data.token)
          
          if (data.user.userType) {
            router.push('/')
          } else {
            router.push('/onboarding')
          }
        } else {
          setMessage(`Token oluşturma hatası: ${data.message || 'Bilinmeyen hata'}`)
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        }
      })
      .catch(error => {
        console.error('Token alma hatası:', error)
        setMessage('Token alma sırasında bir hata oluştu')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      })
    } else if (status === 'unauthenticated') {
      setMessage('Giriş yapılmadı. Giriş sayfasına yönlendiriliyorsunuz...')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } else {
      setMessage('Oturum bilgileri kontrol ediliyor...')
    }
  }, [session, status, router, searchParams])

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      {status === 'loading' && (
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em]" />
        </div>
      )}
      <p className="text-xl font-medium mb-4">{message}</p>
    </div>
  )
}

export default function AuthHandlerPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mb-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em]" />
          </div>
          <p className="text-xl font-medium mb-4">Yükleniyor...</p>
        </div>
      }>
        <AuthHandlerContent />
      </Suspense>
    </div>
  )
} 