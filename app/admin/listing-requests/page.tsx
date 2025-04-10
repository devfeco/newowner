'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi'
import { ListingCard } from '@/app/components/ui/ListingCard'

interface Listing {
  _id: string
  type: string
  location: string
  foundingDate: string
  category: string
  yearlySales: number
  yearlyProfit: number
  salesCount: number
  price: number
  listingDescription: string
  isApproved: boolean
  brandName: string
  userId: string
  createdAt: string
}

export default function ListingRequestsPage() {
  const { state } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Admin değilse ana sayfaya yönlendir
    if (state.user?.userType !== 'admin') {
      router.push('/')
      return
    }
    
    fetchListings()
  }, [state.user, router])
  
  const fetchListings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('Token bulunamadı!')
        return
      }
      
      const response = await fetch('/api/listings?isApproved=false', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setListings(data.listings)
      } else {
        console.error('İlan talepleri getirilemedi:', data.message)
      }
    } catch (error) {
      console.error('İlan talepleri getirme hatası:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const approveRejectListing = async (id: string, approve: boolean) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Oturum bulunamadı! Lütfen tekrar giriş yapın.')
        return
      }
      
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isApproved: approve
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(approve ? 'İlan onaylandı!' : 'İlan reddedildi!')
        // Listeyi güncelle
        fetchListings()
      } else {
        alert(`İşlem sırasında bir hata oluştu: ${data.message}`)
      }
    } catch (error) {
      console.error('İşlem hatası:', error)
      alert('İşlem sırasında bir hata oluştu')
    }
  }
  
  return (
    <div className="min-h-screen bg-[#a9e4e8] bg-opacity-20 py-12">
      <div className="w-[70%] mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-semibold">İlan Talepleri</h1>
            </div>
            <div className="bg-blue-50 text-blue-700 py-1 px-3 rounded-lg text-sm">
              {listings.length} Bekleyen İlan
            </div>
          </div>
          
          {/* İçerik */}
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500">Bekleyen ilan talebi bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {listings.map((listing) => (
                <div key={listing._id} className="relative">
                  <ListingCard
                    _id={listing._id}
                    brandName={listing.brandName}
                    location={listing.location}
                    foundingDate={listing.foundingDate}
                    category={listing.category}
                    yearlySales={listing.yearlySales.toString()}
                    yearlyProfit={listing.yearlyProfit.toString()}
                    salesCount={listing.salesCount?.toString()}
                    price={listing.price.toString()}
                    listingDescription={listing.listingDescription}
                    status="Onay Bekliyor"
                    userId={listing.userId}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => approveRejectListing(listing._id, true)}
                      className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg"
                    >
                      <FiCheck size={16} />
                      <span>Onayla</span>
                    </button>
                    
                    <button
                      onClick={() => approveRejectListing(listing._id, false)}
                      className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg"
                    >
                      <FiX size={16} />
                      <span>Reddet</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 