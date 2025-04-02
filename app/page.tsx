'use client'

import React from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { Button } from './components/ui/Button'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { state, logout } = useAuth()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }
  
  return (
    <ProtectedRoute requireUserType={true}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ana Sayfa</h1>
          <Button 
            onClick={handleLogout}
            variant="destructive"
          >
            Çıkış Yap
          </Button>
        </div>
        
        <p className="mb-4">Hoş geldiniz, {state.user?.name || 'Kullanıcı'}</p>
        
        {state.user?.userType === 'buyer' && (
          <div className="p-6 max-w-lg w-full bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Alıcı Paneli</h2>
            <p>Hizmet almak için satıcıları keşfedin ve teklifler alın.</p>
          </div>
        )}
        
        {state.user?.userType === 'seller' && (
          <div className="p-6 max-w-lg w-full bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Satıcı Paneli</h2>
            <p>Hizmetlerinizi yönetin ve yeni müşteriler bulun.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
