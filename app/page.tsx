'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ListingCard } from './components/ui/ListingCard'
import { ListingCardSkeleton } from './components/ui/ListingCardSkeleton'
import { FiSearch, FiBell, FiGrid, FiLayers, FiSettings, FiCheckSquare, FiMessageSquare, FiChevronDown, FiLogOut, FiPlusCircle, FiUser, FiTwitter, FiLinkedin, FiInstagram, FiHeart, FiMenu } from 'react-icons/fi'
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

export default function HomePage() {
  const { state, logout } = useAuth()
  const router = useRouter()
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings?isApproved=true')
        const data = await response.json()
        if (data.success) {
          setListings(data.listings)
        }
      } catch (error) {
        console.error('İlanları getirme hatası:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchListings()
  }, [])
  
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

  const navigateToFavorites = () => {
    setShowMobileMenu(false)
    router.push('/favorites')
  }
  
  return (
    <div className="min-h-screen bg-[#a9e4e8] bg-opacity-20 pt-2 sm:pt-4">
      <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[70%] mx-auto px-3 sm:px-0">
        {/* Header */}
        <header className="bg-white rounded-xl mt-2 sm:mt-4 shadow-sm py-3 sm:py-6 px-3 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="font-semibold text-lg text-gray-900">
                <div className="w-24 sm:w-28 h-7 sm:h-8 relative">
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
                <button 
                  onClick={() => router.push('/about')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Hakkımızda
                </button>
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
                onClick={navigateToFavorites}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <FiHeart size={16} />
                <span className="text-sm font-medium">Favorilerim</span>
              </button>
              
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FiUser size={18} />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{state.user?.name || 'Kullanıcı'}</div>
                  <div className="text-xs text-gray-700">{getUserRole()}</div>
                </div>
              </div>
              <div className="relative">
                <button 
                  className="hidden sm:block p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                >
                  <FiSettings size={20} />
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
              
              {/* Mobil Menü Butonu */}
              <button 
                className="sm:hidden p-1.5 text-gray-700 rounded-md"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
          
          {/* Mobil Menü */}
          {showMobileMenu && (
            <div className="sm:hidden mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FiUser size={16} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{state.user?.name || 'Kullanıcı'}</div>
                  <div className="text-xs text-gray-700">{getUserRole()}</div>
                </div>
              </div>
              
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => {
                    setShowMobileMenu(false)
                    router.push('/about')
                  }}
                  className="flex w-full items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <FiUser size={16} />
                  <span className="text-sm">Hakkımızda</span>
                </button>
                
                <button
                  onClick={navigateToFavorites}
                  className="flex w-full items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <FiHeart size={16} />
                  <span className="text-sm">Favorilerim</span>
                </button>
                
                {isSeller && (
                  <button 
                    onClick={handleNewListing}
                    className="flex w-full items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 text-gray-700"
                  >
                    <FiPlusCircle size={16} />
                    <span className="text-sm">Yeni İlan Oluştur</span>
                  </button>
                )}
                
                {state.user?.userType === 'admin' && (
                  <>
                    <button 
                      onClick={() => {
                        setShowMobileMenu(false)
                        router.push('/admin/listing-requests')
                      }}
                      className="flex w-full items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 text-gray-700"
                    >
                      <FiCheckSquare size={16} />
                      <span className="text-sm">İlan Talepleri</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowMobileMenu(false)
                        router.push('/admin/appointment-requests')
                      }}
                      className="flex w-full items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 text-gray-700"
                    >
                      <FiMessageSquare size={16} />
                      <span className="text-sm">Randevu Talepleri</span>
                    </button>
                  </>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <FiLogOut size={16} />
                  <span className="text-sm">Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}
        </header>
        
        {/* Listing Cards Section with Filters */}
        <div className="bg-white rounded-xl mt-4 sm:mt-8">
          {/* Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-gray-100 overflow-x-auto whitespace-nowrap md:whitespace-normal">
            <div className="flex flex-nowrap md:flex-wrap items-center gap-2">
              {/* Filtreleme butonları - şimdilik kullanılmıyor 
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-xs sm:text-sm bg-white flex items-center gap-1 min-w-[90px] sm:min-w-[120px] text-gray-800">
                  <span>Girişim Türü</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-xs sm:text-sm bg-white flex items-center gap-1 min-w-[90px] sm:min-w-[120px] text-gray-800">
                  <span>Sıralama</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative hidden sm:block">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-xs sm:text-sm bg-white flex items-center gap-1 min-w-[90px] sm:min-w-[120px] text-gray-800">
                  <span>Platform</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-xs sm:text-sm bg-white flex items-center gap-1 min-w-[90px] sm:min-w-[120px] text-gray-800">
                  <span>Fiyat</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative hidden md:block">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-xs sm:text-sm bg-white flex items-center gap-1 min-w-[90px] sm:min-w-[120px] text-gray-800">
                  <span>Kar Oranı</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative hidden lg:block">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-xs sm:text-sm bg-white flex items-center gap-1 min-w-[90px] sm:min-w-[120px] text-gray-800">
                  <span>Yıllık Ciro</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative hidden xl:block">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-xs sm:text-sm bg-white flex items-center gap-1 min-w-[90px] sm:min-w-[120px] text-gray-800">
                  <span>Düşüş Trendi</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              */}
              
              <div className="w-full relative">
                <input 
                  type="text" 
                  placeholder="E-ticaret girişimi ara" 
                  className="w-full pl-10 pr-4 py-2 rounded-md border text-sm text-gray-900"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  <FiSearch size={16} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Cards Container */}
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {loading ? (
              <>
                <ListingCardSkeleton />
                <ListingCardSkeleton />
                <ListingCardSkeleton />
              </>
            ) : listings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Henüz onaylanmış ilan bulunmuyor.</p>
              </div>
            ) : (
              listings.map((listing) => (
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
      
      {/* Footer */}
      <footer className="bg-white mt-8 border-t border-gray-100">
        <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[70%] mx-auto py-6 sm:py-8 px-4 sm:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Logo ve Açıklama */}
            <div className="col-span-1">
              <div className="w-24 sm:w-28 h-7 sm:h-8 relative mb-3 sm:mb-4">
                <Image
                  src="/images/newowner-logo.png"
                  alt="NewOwner Logo"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                E-ticaret'e başlamanın en kolay yolu
              </p>
            </div>

            {/* Yasal */}
            <div className="col-span-1">
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-4 text-sm sm:text-base">Yasal</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a href="/privacy" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                    Gizlilik Politikası
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                    Kullanım Koşulları
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                    Çerez Politikası
                  </a>
                </li>
              </ul>
            </div>

            {/* İletişim */}
            <div className="col-span-1">
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-4 text-sm sm:text-base">İletişim</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li className="text-xs sm:text-sm text-gray-600">
                  Email: info@newowner.com
                </li>
                <li className="text-xs sm:text-sm text-gray-600">
                  Tel: +90 (212) 123 45 67
                </li>
                <li className="text-xs sm:text-sm text-gray-600">
                  Adres: İstanbul, Türkiye
                </li>
              </ul>
            </div>
          </div>

          {/* Alt Footer */}
          <div className="border-t border-gray-100 mt-6 sm:mt-8 pt-4 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0">
                © 2025 NewOwner. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <FiTwitter size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <FiLinkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <FiInstagram size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
