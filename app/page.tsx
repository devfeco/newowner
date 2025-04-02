'use client'

import React, { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ListingCard } from './components/ui/ListingCard'
import { FiSearch, FiBell, FiGrid, FiLayers, FiSettings, FiCheckSquare, FiMessageSquare, FiChevronDown, FiLogOut, FiPlusCircle, FiUser } from 'react-icons/fi'
import Image from 'next/image'

export default function HomePage() {
  const { state, logout } = useAuth()
  const router = useRouter()
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  
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
  
  return (
    <div className="min-h-screen bg-[#a9e4e8] bg-opacity-20 pt-4">
      <div className="w-[70%] mx-auto">
        {/* Header */}
        <header className="bg-white rounded-xl mt-8 shadow-sm py-6 px-6">
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
                <span>Girişimler</span>
                <span>Erişim Talepleri</span>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <button className="p-2 text-gray-700">
                <FiCheckSquare size={20} />
              </button>
              <button className="p-2 text-gray-700">
                <FiGrid size={20} />
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
            {/* Card 1 */}
            <div className="border border-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-1 text-sm mb-2">
                <span className="text-gray-700">Türü:</span>
                <span className="font-medium text-gray-900">E-Ticaret Markası</span>
                <span className="text-gray-700 ml-4">Merkez:</span>
                <span className="font-medium text-gray-900">İstanbul</span>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    K
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Kuruluş:</span>
                    <span className="font-medium text-gray-900 ml-1">2019</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    K
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Kategori:</span>
                    <span className="font-medium text-gray-900 ml-1">Ev Tekstili</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    Y
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Yıllık Ciro:</span>
                    <span className="font-medium text-gray-900 ml-1">1 Milyon TL</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    Y
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Yıllık Kar:</span>
                    <span className="font-medium text-gray-900 ml-1">500 Bin TL</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    M
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Müşteri Sayısı:</span>
                    <span className="font-medium text-gray-900 ml-1">1.000</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    F
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Fiyat:</span>
                    <span className="font-medium text-gray-900 ml-1">6 Milyon TL</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900">Marka Patentli E-Ticaret Sitesi</h3>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF3] border border-[#ABEFC6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></div>
                  <span className="text-[10px] font-medium text-[#027A48]">Doğrulandı</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-800 leading-relaxed mb-4">
                Yıl sonu, Almanya'da kurulacak şirketden dolayı ülkemizden ayrılacağım. Şuanda da buradaki işlerimin yoğunluğundan dolayı site ile ilgilenemediğimden yeni elemlerle internet ile ilgilenen kişi sadece ben olduğum için perde sitemize zaman ayıramıyoruz. Satış sebeplerim bunlardır. Siteye erişip sağlayıp whatsapp'dan bilgi almak ve sipariş vermek isteyen günde yazan müşteri sayısı 30 ile 50 aralığındadır. Lakin birçoğu ile malesef ilgilenemiyorum. Son 2 ayda 800'e yakın kişiye whatsapp üzerinden cevap veremedim üstelik halen görüldü bile olmadı.
              </p>
              
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-700 text-xs hover:text-gray-900">
                  <FiSearch className="w-4 h-4" />
                  <span>Detaylar</span>
                </button>
                <button className="flex items-center gap-2 text-gray-700 text-xs hover:text-gray-900">
                  <FiBell className="w-4 h-4" />
                  <span>İzlemeye Al</span>
                </button>
                <button className="flex items-center gap-2 text-[#6941C6] text-xs hover:text-[#5730a3]">
                  <FiMessageSquare className="w-4 h-4" />
                  <span>Satıcı İle İletişime Geç</span>
                </button>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="border border-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-1 text-sm mb-2">
                <span className="text-gray-700">Türü:</span>
                <span className="font-medium text-gray-900">E-Ticaret Sitesi</span>
                <span className="text-gray-700 ml-4">Merkez:</span>
                <span className="font-medium text-gray-900">Ankara</span>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    K
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Kuruluş:</span>
                    <span className="font-medium text-gray-900 ml-1">2019</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    K
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Kategori:</span>
                    <span className="font-medium text-gray-900 ml-1">Ev Tekstili</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    Y
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Yıllık Ciro:</span>
                    <span className="font-medium text-gray-900 ml-1">1 Milyon TL</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    Y
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Yıllık Kar:</span>
                    <span className="font-medium text-gray-900 ml-1">500 Bin TL</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    M
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Müşteri Sayısı:</span>
                    <span className="font-medium text-gray-900 ml-1">500</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    F
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Fiyat:</span>
                    <span className="font-medium text-gray-900 ml-1">300 Bin TL</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900">Çocuk Giyim E-Ticaret Sitesi</h3>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF3] border border-[#ABEFC6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></div>
                  <span className="text-[10px] font-medium text-[#027A48]">Doğrulandı</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-800 leading-relaxed mb-4">
                2019 yılından beri e-ticaret iş yapmaktayım. Son 1 yılıma tamammen Trendyola geçtik. Aylık ciromuz 40.000 TL. Tüm ürünler kendimize ait, kendi markamız altında satılmaktadır. Web sitemizden ziyade Trendyol mağazamız çok daha fazla ön planda ve son 1 yıldır websitemizden hiç satış gerçekleştirmedik. Bunun başlıca nedenlerinden birisi kargo barişletirmelerdir. Çünkü müşterilerimiz de birçok websitelerinden gidiş, trendyoldan alımını gerçekleştiriyor.
              </p>
              
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-700 text-xs hover:text-gray-900">
                  <FiSearch className="w-4 h-4" />
                  <span>Detaylar</span>
                </button>
                <button className="flex items-center gap-2 text-gray-700 text-xs hover:text-gray-900">
                  <FiBell className="w-4 h-4" />
                  <span>İzlemeye Al</span>
                </button>
                <button className="flex items-center gap-2 text-[#6941C6] text-xs hover:text-[#5730a3]">
                  <FiMessageSquare className="w-4 h-4" />
                  <span>Satıcı İle İletişime Geç</span>
                </button>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="border border-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-1 text-sm mb-2">
                <span className="text-gray-700">Türü:</span>
                <span className="font-medium text-gray-900">E-Ticaret Markası</span>
                <span className="text-gray-700 ml-4">Merkez:</span>
                <span className="font-medium text-gray-900">İstanbul</span>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    K
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Kuruluş:</span>
                    <span className="font-medium text-gray-900 ml-1">2019</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    K
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Kategori:</span>
                    <span className="font-medium text-gray-900 ml-1">Ev Tekstili</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    Y
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Yıllık Ciro:</span>
                    <span className="font-medium text-gray-900 ml-1">1 Milyon TL</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    Y
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Yıllık Kar:</span>
                    <span className="font-medium text-gray-900 ml-1">500 Bin TL</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    M
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Müşteri Sayısı:</span>
                    <span className="font-medium text-gray-900 ml-1">1.000</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium">
                    F
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-700">Fiyat:</span>
                    <span className="font-medium text-gray-900 ml-1">6 Milyon TL</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900">Marka Patentli E-Ticaret Sitesi</h3>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF3] border border-[#ABEFC6]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></div>
                  <span className="text-[10px] font-medium text-[#027A48]">Doğrulandı</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-800 leading-relaxed mb-4">
                Yıl sonu, Almanya'da kurulacak şirketden dolayı ülkemizden ayrılacağım. Şuanda da buradaki işlerimin yoğunluğundan dolayı site ile ilgilenemediğimden yeni elemlerle internet ile ilgilenen kişi sadece ben olduğum için perde sitemize zaman ayıramıyoruz. Satış sebeplerim bunlardır. Siteye erişip sağlayıp whatsapp'dan bilgi almak ve sipariş vermek isteyen günde yazan müşteri sayısı 30 ile 50 aralığındadır. Lakin birçoğu ile malesef ilgilenemiyorum. Son 2 ayda 800'e yakın kişiye whatsapp üzerinden cevap veremedim üstelik halen görüldü bile olmadı.
              </p>
              
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-700 text-xs hover:text-gray-900">
                  <FiSearch className="w-4 h-4" />
                  <span>Detaylar</span>
                </button>
                <button className="flex items-center gap-2 text-gray-700 text-xs hover:text-gray-900">
                  <FiBell className="w-4 h-4" />
                  <span>İzlemeye Al</span>
                </button>
                <button className="flex items-center gap-2 text-[#6941C6] text-xs hover:text-[#5730a3]">
                  <FiMessageSquare className="w-4 h-4" />
                  <span>Satıcı İle İletişime Geç</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
