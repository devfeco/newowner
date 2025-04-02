'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import Image from 'next/image'
import CreateListingForm from '@/app/components/forms/CreateListingForm'

export default function CreateListingPage() {
  const router = useRouter()
  
  return (
    <ProtectedRoute requireUserType={true}>
      <div className="min-h-screen bg-[#A1D9D6] flex flex-col items-center justify-center py-6 px-4">
        {/* Ana içerik alanı */}
        <div className="bg-white rounded-[24px] shadow-lg w-[90%] h-[90%] overflow-hidden">
          {/* Logo kısmı */}
          <div className="py-4 px-8 border-b border-gray-100">
            <div className="flex justify-start">
              <Image
                src="/images/newowner-logo.png"
                alt="NewOwner Logo"
                width={150}
                height={45}
                priority
                className="h-[45px] w-auto"
              />
            </div>
          </div>
          
          {/* İçerik alanı - multistep form */}
          <div className="p-12">
            <CreateListingForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 