'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ListingCard } from './components/ui/ListingCard'
import { ListingCardSkeleton } from './components/ui/ListingCardSkeleton'
import { FiSearch, FiBell, FiGrid, FiLayers, FiSettings, FiCheckSquare, FiMessageSquare, FiChevronDown, FiLogOut, FiPlusCircle, FiUser, FiTwitter, FiLinkedin, FiInstagram, FiHeart, FiMenu, FiFilter, FiX, FiSliders } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'

// Buton stil varyantları için yardımcı sınıf
const buttonStyles = {
  primary: "bg-blue-600 text-white font-medium rounded-full transition-all duration-300 hover:bg-blue-700 flex items-center justify-center px-8 py-3 cursor-pointer",
  secondary: "bg-white text-blue-600 border border-blue-600 font-medium rounded-full transition-all duration-300 hover:bg-gray-50 flex items-center justify-center px-8 py-3 cursor-pointer",
  small: "text-sm px-7 py-2.5",
  medium: "px-8 py-3",
  large: "text-base px-9 py-3.5",
  icon: "gap-3"
};

const CATEGORY_MAP: { [key: string]: string } = {
  'auto': 'Oto Aksesuar',
  'home-textile': 'Ev Tekstili',
  'women-clothing': 'Kadın Giyim',
  'men-clothing': 'Erkek Giyim',
  'electronics': 'Elektronik',
  'cosmetics': 'Kozmetik',
  'shoes-bags': 'Ayakkabı & Çanta',
  'home-living': 'Ev & Yaşam',
  'mother-baby': 'Anne & Bebek',
  'sports': 'Spor & Outdoor',
  'books': 'Kitap & Hobi',
  'pet-supplies': 'Evcil Hayvan',
  'food-beverage': 'Gıda & İçecek',
  'jewelry': 'Takı & Mücevher',
  'other': 'Diğer'
}

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
  listingTitle: string
}

export default function HomePage() {
  const { state, logout } = useAuth()
  const router = useRouter()
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  
  // Filtre paneli state'i
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  
  // Filtre state'leri (geçerli filtreler - API'de kullanılan)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<{min?: number, max?: number}>({})
  const [yearlySalesRange, setYearlySalesRange] = useState<{min?: number, max?: number}>({})
  const [yearlyProfitRange, setYearlyProfitRange] = useState<{min?: number, max?: number}>({})
  
  // Geçici filtre state'leri (panel içindeki değişiklikler için)
  const [tempCategory, setTempCategory] = useState<string>('')
  const [tempPriceRange, setTempPriceRange] = useState<{min?: number, max?: number}>({})
  const [tempYearlySalesRange, setTempYearlySalesRange] = useState<{min?: number, max?: number}>({})
  const [tempYearlyProfitRange, setTempYearlyProfitRange] = useState<{min?: number, max?: number}>({})
  
  // Filtreler açıldığında, geçici state'lere mevcut değerleri kopyala
  useEffect(() => {
    if (showFilterPanel) {
      setTempCategory(selectedCategory)
      setTempPriceRange({...priceRange})
      setTempYearlySalesRange({...yearlySalesRange})
      setTempYearlyProfitRange({...yearlyProfitRange})
    }
  }, [showFilterPanel, selectedCategory, priceRange, yearlySalesRange, yearlyProfitRange])
  
  // Filtre sayacı
  const getActiveFilterCount = () => {
    let count = 0
    if (selectedCategory) count++
    if (priceRange.min !== undefined || priceRange.max !== undefined) count++
    if (yearlySalesRange.min !== undefined || yearlySalesRange.max !== undefined) count++
    if (yearlyProfitRange.min !== undefined || yearlyProfitRange.max !== undefined) count++
    return count
  }
  
  // Debounce için useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  // Arama terimi değiştiğinde ilan getirme işlemini tetikle
  useEffect(() => {
    fetchListings()
  }, [debouncedSearchTerm])
  
  const fetchListings = useCallback(async () => {
    setIsSearching(!!debouncedSearchTerm)
    setLoading(true)
    
    try {
      let url = `/api/listings?isApproved=true`
      
      // Arama terimi
      if (debouncedSearchTerm) {
        url += `&searchTerm=${encodeURIComponent(debouncedSearchTerm)}`
      }
      
      // Kategori filtresi
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`
      }
      
      // Fiyat filtresi - sayısal değer kontrolü
      if (priceRange.min !== undefined && priceRange.min !== null && !isNaN(priceRange.min)) {
        url += `&priceMin=${priceRange.min}`
      }
      if (priceRange.max !== undefined && priceRange.max !== null && !isNaN(priceRange.max)) {
        url += `&priceMax=${priceRange.max}`
      }
      
      // Yıllık ciro filtresi - sayısal değer kontrolü
      if (yearlySalesRange.min !== undefined && yearlySalesRange.min !== null && !isNaN(yearlySalesRange.min)) {
        url += `&yearlySalesMin=${yearlySalesRange.min}`
      }
      if (yearlySalesRange.max !== undefined && yearlySalesRange.max !== null && !isNaN(yearlySalesRange.max)) {
        url += `&yearlySalesMax=${yearlySalesRange.max}`
      }
      
      // Yıllık kar filtresi - sayısal değer kontrolü
      if (yearlyProfitRange.min !== undefined && yearlyProfitRange.min !== null && !isNaN(yearlyProfitRange.min)) {
        url += `&yearlyProfitMin=${yearlyProfitRange.min}`
      }
      if (yearlyProfitRange.max !== undefined && yearlyProfitRange.max !== null && !isNaN(yearlyProfitRange.max)) {
        url += `&yearlyProfitMax=${yearlyProfitRange.max}`
      }
      
      console.log('API URL:', url)
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setListings(data.listings)
        console.log('Getirilen kayıtlar:', data.listings.length)
        if (data.listings.length > 0) {
          console.log('İlk kayıt örneği - fiyat:', data.listings[0].price)
        }
      }
    } catch (error) {
      console.error('İlanları getirme hatası:', error)
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }, [debouncedSearchTerm, selectedCategory, priceRange, yearlySalesRange, yearlyProfitRange])
  
  // Sayfa yüklendiğinde ilanları getir
  useEffect(() => {
    fetchListings()
  }, [])
  
  // Filtre reset fonksiyonu
  const resetFilters = () => {
    // Tüm filtreleri ve geçici filtreleri sıfırla
    setSelectedCategory('')
    setPriceRange({})
    setYearlySalesRange({})
    setYearlyProfitRange({})
    
    setTempCategory('')
    setTempPriceRange({})
    setTempYearlySalesRange({})
    setTempYearlyProfitRange({})
    
    // Filtreleri kapatma ve yeni API çağrısı
    setShowFilterPanel(false)
    
    // Tüm filtreler temizlendikten sonra, özel olarak sadece isApproved=true ile API çağrısı yap
    setTimeout(() => {
      fetchAllListings()
    }, 0)
  }
  
  // Tüm kayıtları getirmek için özel fonksiyon
  const fetchAllListings = async () => {
    setLoading(true)
    
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
      setIsSearching(false)
    }
  }
  
  // Uygula butonu fonksiyonu
  const applyFilters = () => {
    // Geçici filtreleri gerçek filtrelere uygula
    setSelectedCategory(tempCategory)
    
    // Fiyat aralığı için değer kontrolü yap
    const minPrice = tempPriceRange.min === undefined || isNaN(tempPriceRange.min) ? undefined : tempPriceRange.min
    const maxPrice = tempPriceRange.max === undefined || isNaN(tempPriceRange.max) ? undefined : tempPriceRange.max
    setPriceRange({ min: minPrice, max: maxPrice })
    
    // Yıllık ciro için değer kontrolü yap
    const minYearlySales = tempYearlySalesRange.min === undefined || isNaN(tempYearlySalesRange.min) ? undefined : tempYearlySalesRange.min
    const maxYearlySales = tempYearlySalesRange.max === undefined || isNaN(tempYearlySalesRange.max) ? undefined : tempYearlySalesRange.max
    setYearlySalesRange({ min: minYearlySales, max: maxYearlySales })
    
    // Yıllık kar için değer kontrolü yap
    const minYearlyProfit = tempYearlyProfitRange.min === undefined || isNaN(tempYearlyProfitRange.min) ? undefined : tempYearlyProfitRange.min
    const maxYearlyProfit = tempYearlyProfitRange.max === undefined || isNaN(tempYearlyProfitRange.max) ? undefined : tempYearlyProfitRange.max
    setYearlyProfitRange({ min: minYearlyProfit, max: maxYearlyProfit })
    
    // Filtreleri kapatma ve yeni API çağrısı
    setShowFilterPanel(false)
    
    // Filtreleri API'ye göndermek için timeout kullan (state'lerin güncellenmesini bekle)
    setTimeout(() => {
      fetchListings()
    }, 0)
  }
  
  // Tekil filtre silme fonksiyonları
  const clearCategoryFilter = () => {
    setSelectedCategory('')
    setTimeout(() => {
      fetchListings()
    }, 0)
  }
  
  const clearPriceFilter = () => {
    setPriceRange({})
    setTimeout(() => {
      fetchListings()
    }, 0)
  }
  
  const clearYearlySalesFilter = () => {
    setYearlySalesRange({})
    setTimeout(() => {
      fetchListings()
    }, 0)
  }
  
  const clearYearlyProfitFilter = () => {
    setYearlyProfitRange({})
    setTimeout(() => {
      fetchListings()
    }, 0)
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

  const navigateToFavorites = () => {
    setShowMobileMenu(false)
    router.push('/favorites')
  }
  
  // Arama inputu değişikliği
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
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
              {state.isAuthenticated ? (
                <>
                  <Link href="/pricing">
                    <button className="relative group overflow-hidden px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                      <span className="relative z-10 flex items-center">
                        <svg 
                          className="w-4 h-4 mr-1.5 text-yellow-300" 
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>Premium Ol</span>
                      </span>
                      <span className="absolute -bottom-2 left-1/2 w-9/12 h-1 bg-yellow-300 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    </button>
                  </Link>
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
                </>
              ) : (
                <button
                  onClick={() => router.push('/auth/register')}
                  className={`${buttonStyles.primary} ${buttonStyles.icon} px-6 py-2.5 text-sm`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Üye Ol</span>
                </button>
              )}
              
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
              {state.isAuthenticated ? (
                <>
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
                    <Link href="/pricing">
                      <button className="flex w-full items-center gap-2 py-2.5 px-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-md shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300">
                        <svg 
                          className="w-4 h-4 text-yellow-300" 
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">Premium Ol</span>
                      </button>
                    </Link>

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
                </>
              ) : (
                <div className="py-3">
                  <button 
                    onClick={() => router.push('/auth/register')}
                    className={`${buttonStyles.primary} ${buttonStyles.icon} w-full py-2.5 text-sm flex items-center justify-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Üye Ol</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </header>
        
        {/* Listing Cards Section with Filters */}
        <div className="bg-white rounded-xl mt-4 sm:mt-8 relative">
          {/* Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilterPanel(true)}
                className="flex items-center gap-2 py-2 px-3 rounded-md border bg-white text-gray-800 hover:bg-gray-50"
              >
                <FiFilter size={16} />
                <span className="text-sm">Filtreler</span>
                {getActiveFilterCount() > 0 && (
                  <span className="ml-1 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
              
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:underline"
                >
                  Temizle
                </button>
              )}
            </div>
            
            <div className="flex-1 max-w-xl ml-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="E-ticaret girişimi ara" 
                  className="w-full pl-10 pr-4 py-2 rounded-md border text-sm text-gray-900"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  <FiSearch size={16} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Modal/Panel */}
          {showFilterPanel && (
            <>
              <div 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                className="fixed inset-0 z-50"
                onClick={() => setShowFilterPanel(false)}
              ></div>
              
              <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiSliders className="mr-2" />
                    Filtreleme Seçenekleri
                  </h3>
                  <button 
                    onClick={() => setShowFilterPanel(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Kategori filtresi */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Kategori</h4>
                    <select
                      className="w-full p-2 border rounded-md bg-white text-gray-900"
                      value={tempCategory}
                      onChange={(e) => setTempCategory(e.target.value)}
                    >
                      <option value="">Tüm Kategoriler</option>
                      {Object.entries(CATEGORY_MAP).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Fiyat aralığı */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Fiyat Aralığı (₺)</h4>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full p-2 border rounded text-gray-900"
                        value={tempPriceRange.min === undefined ? '' : tempPriceRange.min}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setTempPriceRange({...tempPriceRange, min: value})
                        }}
                      />
                      <span className="text-gray-900">-</span>
                      <input 
                        type="number" 
                        placeholder="Maks" 
                        className="w-full p-2 border rounded text-gray-900"
                        value={tempPriceRange.max === undefined ? '' : tempPriceRange.max}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setTempPriceRange({...tempPriceRange, max: value})
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Yıllık ciro aralığı */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Yıllık Ciro Aralığı (₺)</h4>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full p-2 border rounded text-gray-900"
                        value={tempYearlySalesRange.min === undefined ? '' : tempYearlySalesRange.min}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setTempYearlySalesRange({...tempYearlySalesRange, min: value})
                        }}
                      />
                      <span className="text-gray-900">-</span>
                      <input 
                        type="number" 
                        placeholder="Maks" 
                        className="w-full p-2 border rounded text-gray-900"
                        value={tempYearlySalesRange.max === undefined ? '' : tempYearlySalesRange.max}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setTempYearlySalesRange({...tempYearlySalesRange, max: value})
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Yıllık kar aralığı */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Yıllık Kar Aralığı (₺)</h4>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full p-2 border rounded text-gray-900"
                        value={tempYearlyProfitRange.min === undefined ? '' : tempYearlyProfitRange.min}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setTempYearlyProfitRange({...tempYearlyProfitRange, min: value})
                        }}
                      />
                      <span className="text-gray-900">-</span>
                      <input 
                        type="number" 
                        placeholder="Maks" 
                        className="w-full p-2 border rounded text-gray-900"
                        value={tempYearlyProfitRange.max === undefined ? '' : tempYearlyProfitRange.max}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setTempYearlyProfitRange({...tempYearlyProfitRange, max: value})
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t flex gap-3 mt-auto sticky bottom-0 bg-white">
                  <button 
                    onClick={resetFilters}
                    className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200"
                  >
                    Temizle
                  </button>
                  <button 
                    onClick={applyFilters}
                    className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </>
          )}
          
          {/* Aktif filtreleri göster */}
          {getActiveFilterCount() > 0 && (
            <div className="px-4 py-2 bg-gray-50 flex flex-wrap gap-2 items-center text-sm">
              <span className="text-gray-600">Aktif filtreler:</span>
              
              {selectedCategory && (
                <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center gap-1">
                  <span>Kategori: {CATEGORY_MAP[selectedCategory]}</span>
                  <button 
                    onClick={clearCategoryFilter}
                    className="ml-1 p-0.5"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
              
              {(priceRange.min !== undefined || priceRange.max !== undefined) && (
                <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center gap-1">
                  <span>Fiyat: {priceRange.min || '0'} - {priceRange.max || '∞'} ₺</span>
                  <button 
                    onClick={clearPriceFilter}
                    className="ml-1 p-0.5"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
              
              {(yearlySalesRange.min !== undefined || yearlySalesRange.max !== undefined) && (
                <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center gap-1">
                  <span>Yıllık Ciro: {yearlySalesRange.min || '0'} - {yearlySalesRange.max || '∞'} ₺</span>
                  <button 
                    onClick={clearYearlySalesFilter}
                    className="ml-1 p-0.5"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
              
              {(yearlyProfitRange.min !== undefined || yearlyProfitRange.max !== undefined) && (
                <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center gap-1">
                  <span>Yıllık Kar: {yearlyProfitRange.min || '0'} - {yearlyProfitRange.max || '∞'} ₺</span>
                  <button 
                    onClick={clearYearlyProfitFilter}
                    className="ml-1 p-0.5"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
          
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
                {debouncedSearchTerm ? (
                  <p className="text-gray-600">"{debouncedSearchTerm}" için sonuç bulunamadı.</p>
                ) : (
                  <p className="text-gray-600">Henüz onaylanmış ilan bulunmuyor.</p>
                )}
              </div>
            ) : (
              <>
                {debouncedSearchTerm && (
                  <div className="pb-2">
                    <p className="text-sm text-gray-500">
                      "{debouncedSearchTerm}" için {listings.length} sonuç bulundu
                    </p>
                  </div>
                )}
                {listings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    _id={listing._id.toString()}
                    listingTitle={listing.listingTitle}
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
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 py-16 mt-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-200 rounded-full opacity-60 blur-xl"></div>
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-200 rounded-full opacity-60 blur-xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg font-medium px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
              Yeni
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Premium Üyelik Avantajlarını <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Keşfedin</span>
          </h2>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
            Premium üye olarak detaylı finansal raporlara, öncelikli görüşmelere ve aracılık hizmetlerine erişin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {state.isAuthenticated ? (
              <Link href="/pricing">
                <button className="relative overflow-hidden px-10 py-4 rounded-xl text-base font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute inset-0 w-0 bg-white opacity-20 transition-all duration-300 group-hover:w-full"></div>
                  <div className="flex items-center justify-center relative z-10">
                    <svg 
                      className="w-5 h-5 mr-2 text-yellow-300" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Hemen Premium Ol</span>
                  </div>
                </button>
              </Link>
            ) : (
              <Link href="/auth/login?callbackUrl=/pricing">
                <button className="relative overflow-hidden px-10 py-4 rounded-xl text-base font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute inset-0 w-0 bg-white opacity-20 transition-all duration-300 group-hover:w-full"></div>
                  <div className="flex items-center justify-center relative z-10">
                    <svg 
                      className="w-5 h-5 mr-2 text-yellow-300" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                    <span>Giriş Yap ve Premium Ol</span>
                  </div>
                </button>
              </Link>
            )}
            <Link href="/pricing">
              <button className="px-10 py-4 rounded-xl text-base font-medium bg-white text-indigo-600 border border-indigo-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                <svg 
                  className="w-5 h-5 mr-2 text-indigo-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Detaylı Bilgi</span>
              </button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm text-gray-700">Detaylı finansal raporlar</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm text-gray-700">Öncelikli görüşmeler</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm text-gray-700">7/24 destek</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm text-gray-700">İşlemlerde öncelik</span>
            </div>
          </div>
        </div>
      </section>

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
