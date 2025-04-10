'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ListingCard } from '../components/ui/ListingCard'
import { ListingCardSkeleton } from '../components/ui/ListingCardSkeleton'
import { FiArrowLeft, FiHeart, FiSettings, FiLogOut, FiPlusCircle, FiUser, FiMenu } from 'react-icons/fi'
import Image from 'next/image'

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
}

export default function FavoritesPage() {
  const { state, logout } = useAuth()
  const router = useRouter()
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  useEffect(() => {
    // Kullanıcı giriş yapmadıysa anasayfaya yönlendir
    if (!state.isAuthenticated) {
      router.push('/')
      return
    }
    
    fetchFavoriteListings()
  }, [state.user, state.isAuthenticated, router])
  
  const fetchFavoriteListings = async () => {
    if (!state.user) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${state.user._id}/favorites`)
      const data = await response.json()
      if (data.success) {
        setFavoriteListings(data.favorites)
      } else {
        console.error('Favori ilanları getirme hatası:', data.message)
      }
    } catch (error) {
      console.error('Favori ilanları getirme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }
  
  const getUserRole = () => {
    if (!state.user) return 'Kullanıcı'
    if (state.user.userType === 'seller') return 'Satıcı'
    if (state.user.userType === 'buyer') return 'Alıcı'
    return 'Süper Admin'
  }
  
  const isSeller = state.user?.userType === 'seller'
  
  const handleNewListing = () => {
    setShowSettingsMenu(false)
    setShowMobileMenu(false)
    router.push('/listings/create')
  }
  
  return (
    <div className="min-h-screen bg-[#a9e4e8] bg-opacity-20 pt-2 sm:pt-4">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg sm:rounded-xl mt-2 sm:mt-4 shadow-sm py-3 sm:py-6 px-3 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="font-semibold text-base sm:text-lg text-gray-900 cursor-pointer" onClick={() => router.push('/')}>
                <div className="w-20 sm:w-28 h-6 sm:h-8 relative">
                  <Image
                    src="/images/newowner-logo.png"
                    alt="NewOwner Logo"
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
              </div>
              <div className="hidden md:flex space-x-6 text-gray-700 text-sm">
                {state.user?.userType === 'admin' && (
                  <>
                    <button 
                      onClick={() => router.push('/admin/listing-requests')}
                      className="hover:text-blue-600 transition-colors"
                    >
                      İlan Talepleri
                    </button>
                    <button 
                      onClick={() => router.push('/admin/appointment-requests')}
                      className="hover:text-blue-600 transition-colors"
                    >
                      Randevu Talepleri
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-5">
              <button
                className="hidden sm:flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-blue-100 text-blue-600"
              >
                <FiHeart size={16} />
                <span className="text-xs sm:text-sm font-medium">Favorilerim</span>
              </button>
              
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FiUser size={16} className="sm:hidden" />
                  <FiUser size={20} className="hidden sm:block" />
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-medium text-gray-900">{state.user?.name || 'Kullanıcı'}</div>
                  <div className="text-xs text-gray-700">{getUserRole()}</div>
                </div>
              </div>
              
              {/* Desktop ayarlar düğmesi */}
              <div className="relative hidden sm:block">
                <button 
                  className="p-1 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                >
                  <FiSettings size={18} className="sm:hidden" />
                  <FiSettings size={20} className="hidden sm:block" />
                </button>
                
                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    {isSeller && (
                      <button 
                        onClick={handleNewListing}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FiPlusCircle size={16} />
                        <span>Yeni İlan Oluştur</span>
                      </button>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut size={16} />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Mobil menü düğmesi */}
              <button 
                className="sm:hidden p-1 text-gray-700 hover:bg-gray-100 rounded-full"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
          
          {/* Mobil menü */}
          {showMobileMenu && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3 pb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FiUser size={18} />
                </div>
                <div className="text-xs">
                  <div className="font-medium text-gray-900">{state.user?.name || 'Kullanıcı'}</div>
                  <div className="text-xs text-gray-700">{getUserRole()}</div>
                </div>
              </div>
              
              <button
                className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <FiHeart size={14} />
                <span>Favorilerim</span>
              </button>
              
              {state.user?.userType === 'admin' && (
                <>
                  <button 
                    onClick={() => {
                      setShowMobileMenu(false)
                      router.push('/admin/listing-requests')
                    }}
                    className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    İlan Talepleri
                  </button>
                  <button 
                    onClick={() => {
                      setShowMobileMenu(false)
                      router.push('/admin/appointment-requests')
                    }}
                    className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Randevu Talepleri
                  </button>
                </>
              )}
              
              {isSeller && (
                <button 
                  onClick={handleNewListing}
                  className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <FiPlusCircle size={14} />
                  <span>Yeni İlan Oluştur</span>
                </button>
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <FiLogOut size={14} />
                <span>Çıkış Yap</span>
              </button>
            </div>
          )}
        </header>
        
        {/* Favoriler Başlığı */}
        <div className="bg-white rounded-lg sm:rounded-xl mt-3 sm:mt-8 p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft size={14} className="sm:hidden" />
                <FiArrowLeft size={16} className="hidden sm:block" />
                <span>Geri Dön</span>
              </button>
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 flex items-center gap-1 sm:gap-2">
                <FiHeart className="text-red-500" size={16} className="sm:hidden" />
                <FiHeart className="text-red-500" size={20} className="hidden sm:block" />
                Favori İlanlarım
              </h1>
            </div>
          </div>
          
          {/* Favoriler Listesi */}
          <div className="space-y-3 sm:space-y-6">
            {loading ? (
              <>
                <ListingCardSkeleton />
                <ListingCardSkeleton />
                <ListingCardSkeleton />
              </>
            ) : favoriteListings.length === 0 ? (
              <div className="text-center py-6 sm:py-12">
                <FiHeart size={36} className="sm:text-4xl text-gray-300 mx-auto mb-2 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">Henüz favori ilanınız bulunmuyor.</p>
                <button 
                  onClick={() => router.push('/')}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  İlanları keşfedin
                </button>
              </div>
            ) : (
              favoriteListings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  _id={listing._id.toString()}
                  brandName={listing.brandName}
                  location={listing.location}
                  foundingDate={listing.foundingDate}
                  category={listing.category}
                  yearlySales={listing.yearlySales.toString()}
                  yearlyProfit={listing.yearlyProfit.toString()}
                  salesCount={listing.salesCount?.toString()}
                  price={listing.price.toString()}
                  listingDescription={listing.listingDescription}
                  status={listing.isApproved ? 'Doğrulandı' : 'Beklemede'}
                  userId={listing.userId}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 