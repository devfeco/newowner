'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/app/components/ui/Button'

export default function TestPage() {
  const { state, logout } = useAuth()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // localStorage'dan token'ı al
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  // localStorage'a test token'ı ekleyen fonksiyon
  const saveTestToken = () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwidXNlclR5cGUiOiJidXllciIsImNyZWF0ZWRBdCI6IjIwMjQtMDEtMDFUMDA6MDA6MDAuMDAwWiIsImlhdCI6MTcxODMxMjQwMCwiZXhwIjoxNzIwOTA0NDAwfQ.JZrPOISgZuI4XgK2LdXa-mDXqRTrbD7c1Ys4sAvdKA4'
    
    localStorage.setItem('token', testToken)
    setToken(testToken)
  }

  // localStorage'dan token'ı silen fonksiyon
  const clearToken = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Token Test Sayfası</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Auth Durumu:</h2>
        <pre className="bg-white p-3 rounded overflow-auto max-w-full">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Mevcut Token:</h2>
        <div className="bg-white p-3 rounded overflow-auto max-w-full break-all">
          {token || 'Token bulunamadı'}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={saveTestToken}>
          Test Token Ekle
        </Button>
        
        <Button onClick={clearToken} variant="outline">
          Token'ı Temizle
        </Button>
        
        <Button onClick={logout} variant="destructive">
          Çıkış Yap (Logout)
        </Button>
      </div>
    </div>
  )
} 