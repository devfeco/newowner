'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ListingCard } from './components/ui/ListingCard'
import { ListingCardSkeleton } from './components/ui/ListingCardSkeleton'
import { FiSearch, FiBell, FiGrid, FiLayers, FiSettings, FiCheckSquare, FiMessageSquare, FiChevronDown, FiLogOut, FiPlusCircle, FiUser, FiTwitter, FiLinkedin, FiInstagram, FiHeart } from 'react-icons/fi'
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
    router.push('/listings/create')
  }

  const navigateToFavorites = () => {
    router.push('/favorites')
  }
  
  return (
    <div className="min-h-screen bg-[#a9e4e8] bg-opacity-20 pt-4">
      <div className="w-[70%] mx-auto">
        {/* Header */}
        <header className="bg-white rounded-xl mt-4 shadow-sm py-6 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="font-semibold text-lg text-gray-900">
                <div className="w-28 h-8 relative">
                  <Image
                    src="/images/newowner-logo.png"
                    alt="NewOwner Logo"
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex space-x-6 text-gray-700 text-sm">
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
            
            <div className="flex items-center gap-5">
              <button
                onClick={navigateToFavorites}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <FiHeart size={16} />
                <span className="text-sm font-medium">Favorilerim</span>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FiUser size={20} />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{state.user?.name || 'Kullanıcı'}</div>
                  <div className="text-xs text-gray-700">{getUserRole()}</div>
                </div>
              </div>
              <div className="relative">
                <button 
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
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
            </div>
        </div>
        </header>
        
        {/* Listing Cards Section with Filters */}
        <div className="bg-white rounded-xl mt-8">
          {/* Filter Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-sm bg-white flex items-center gap-1 min-w-[120px] text-gray-800">
                  <span>Girişim Türü</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-sm bg-white flex items-center gap-1 min-w-[120px] text-gray-800">
                  <span>Sıralama</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-sm bg-white flex items-center gap-1 min-w-[120px] text-gray-800">
                  <span>Platform</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-sm bg-white flex items-center gap-1 min-w-[120px] text-gray-800">
                  <span>Fiyat</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-sm bg-white flex items-center gap-1 min-w-[120px] text-gray-800">
                  <span>Kar Oranı</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-sm bg-white flex items-center gap-1 min-w-[120px] text-gray-800">
                  <span>Yıllık Ciro</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="relative">
                <button className="py-1.5 px-3 pr-8 rounded-md border text-sm bg-white flex items-center gap-1 min-w-[120px] text-gray-800">
                  <span>Düşüş Trendi</span>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                </button>
              </div>
              
              <div className="ml-auto relative w-64">
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
          <div className="p-6 space-y-6">
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
        <div className="w-[70%] mx-auto py-8">
          <div className="grid grid-cols-4 gap-8">
            {/* Logo ve Açıklama */}
            <div className="col-span-1">
              <div className="w-28 h-8 relative mb-4">
                <Image
                  src="/images/newowner-logo.png"
                  alt="NewOwner Logo"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
              <p className="text-sm text-gray-600">
                E-ticaret'e başlamanın en kolay yolu
              </p>
            </div>

            {/* Yasal */}
            <div className="col-span-1">
              <h4 className="font-medium text-gray-900 mb-4">Yasal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    Gizlilik Politikası
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    Kullanım Koşulları
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-sm text-gray-600 hover:text-gray-900">
                    Çerez Politikası
                  </a>
                </li>
              </ul>
            </div>

            {/* İletişim */}
            <div className="col-span-1">
              <h4 className="font-medium text-gray-900 mb-4">İletişim</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">
                  Email: info@newowner.com
                </li>
                <li className="text-sm text-gray-600">
                  Tel: +90 (212) 123 45 67
                </li>
                <li className="text-sm text-gray-600">
                  Adres: İstanbul, Türkiye
                </li>
              </ul>
            </div>
          </div>

          {/* Alt Footer */}
          <div className="border-t border-gray-100 mt-8 pt-8">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2025 NewOwner. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <FiTwitter size={18} />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <FiLinkedin size={18} />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <FiInstagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
