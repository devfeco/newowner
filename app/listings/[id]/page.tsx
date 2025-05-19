'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import { FiArrowLeft, FiHeart, FiMessageSquare, FiShare2, FiAlertTriangle, FiCheckCircle, FiUserPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import MarketplaceChart from '@/app/components/ui/MarketplaceChart';
import SalesDistributionChart from '@/app/components/ui/SalesDistributionChart';
import AppointmentModal from '@/app/components/appointment/AppointmentModal';
import QuestionAnswerSection from '@/app/components/listings/QuestionAnswerSection'

const CATEGORY_MAP = {
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
};

interface Listing {
  _id: string;
  type: string;
  location: string;
  foundingDate: string;
  category: string;
  yearlySales: number;
  yearlyProfit: number;
  salesCount: number;
  price: number;
  listingDescription: string;
  isApproved: boolean;
  brandName: string;
  userId: string;
  listingTitle: string;
  transferItems?: string[];
  ecommerceInfrastructure?: string;
  licenseRenewalDate?: string;
  hasSearchEngineBan?: boolean;
  searchEngineBanDetails?: string;
  socialMediaAccounts?: Record<string, boolean | string>;
  hasLegalObstacles?: boolean;
  legalObstacleDetails?: string;
  founderExperience?: string;
  willProvideSupport?: boolean;
  supportDuration?: string;
  supportDetails?: string;
  
  // Pazaryeri verileri
  hasMarketplaces?: boolean;
  marketplaces?: string[];
  
  // Trendyol
  trendyolSales?: string;
  trendyolRating?: string;
  trendyolProfitMargin?: string;
  trendyolMonthlySales?: {
    month1?: string;
    month2?: string;
    month3?: string;
    month4?: string;
    month5?: string;
    month6?: string;
  };
  
  // Amazon
  amazonSales?: string;
  amazonRating?: string;
  amazonProfitMargin?: string;
  amazonMonthlySales?: {
    month1?: string;
    month2?: string;
    month3?: string;
    month4?: string;
    month5?: string;
    month6?: string;
  };
  
  // Hepsiburada
  hepsiburadaSales?: string;
  hepsiburadaRating?: string;
  hepsiburadaProfitMargin?: string;
  hepsiburadaMonthlySales?: {
    month1?: string;
    month2?: string;
    month3?: string;
    month4?: string;
    month5?: string;
    month6?: string;
  };
  
  // N11
  n11Sales?: string;
  n11Rating?: string;
  n11ProfitMargin?: string;
  n11MonthlySales?: {
    month1?: string;
    month2?: string;
    month3?: string;
    month4?: string;
    month5?: string;
    month6?: string;
  };
  
  // Website
  hasWebsite?: boolean;
  websiteUrl?: string;
  websiteSales?: string;
  websiteProfitMargin?: string;
  websiteMonthlySales?: {
    month1?: string;
    month2?: string;
    month3?: string;
    month4?: string;
    month5?: string;
    month6?: string;
  };
}

interface InfoCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
}

function InfoCard({ title, value, prefix = '', suffix = '' }: InfoCardProps) {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:scale-[1.01] hover:border-blue-200">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600 opacity-60 group-hover:opacity-100 transition-opacity"></div>
      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 group-hover:text-blue-600 transition-colors">{title}</p>
        <div className="flex items-end">
          <p className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
        {prefix}{typeof value === 'number' ? value.toLocaleString('tr-TR') : value}{suffix}
      </p>
        </div>
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const isLoggedIn = Boolean(state.user);
  
  // Herhangi bir aylık veri dizisinden toplam değeri hesaplayan yardımcı fonksiyon
  const calculateChannelTotal = (monthlySales?: any) => {
    if (!monthlySales) return 0;
    
    const values = [
      parseFloat(monthlySales.month1 || '0'),
      parseFloat(monthlySales.month2 || '0'),
      parseFloat(monthlySales.month3 || '0'),
      parseFloat(monthlySales.month4 || '0'),
      parseFloat(monthlySales.month5 || '0'),
      parseFloat(monthlySales.month6 || '0')
    ];
    
    return values.reduce((sum, val) => sum + val, 0);
  };
  
  // Pazaryerleri için toplam satış verilerini hesapla
  const salesDistributionData = useMemo(() => {
    if (!listing) return {};
    
    return {
      trendyol: calculateChannelTotal(listing.trendyolMonthlySales),
      hepsiburada: calculateChannelTotal(listing.hepsiburadaMonthlySales),
      amazon: calculateChannelTotal(listing.amazonMonthlySales),
      n11: calculateChannelTotal(listing.n11MonthlySales),
      website: calculateChannelTotal(listing.websiteMonthlySales)
    };
  }, [listing]);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listings/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setListing(data.listing);
          checkFavorite(data.listing._id);
        } else {
          setError(data.message || 'İlan bilgilerini getirirken bir hata oluştu');
        }
      } catch (error) {
        setError('İlan bilgilerini getirirken bir hata oluştu');
        console.error('İlan detaylarını getirme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchListing();
    }
  }, [id]);
  
  const checkFavorite = async (listingId: string) => {
    if (!state.user) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) return;
      
      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.favorites) {
        setIsFavorite(data.favorites.includes(listingId));
      }
    } catch (error) {
      console.error('Favorileri kontrol ederken hata:', error);
    }
  };
  
  const handleToggleFavorite = async () => {
    if (!state.user) {
      alert('Favorilere eklemek için giriş yapmalısınız');
      return;
    }
    
    setFavoriteLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Oturum bulunamadı! Lütfen tekrar giriş yapın.');
        return;
      }
      
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: id,
          action: isFavorite ? 'remove' : 'add'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsFavorite(!isFavorite);
        alert(isFavorite ? 'İlan izlemeden kaldırıldı' : 'İlan izlemeye alındı');
      } else {
        alert('Hata: ' + data.message);
      }
    } catch (error) {
      console.error('Favori ekleme/çıkarma hatası:', error);
      alert('İşlem sırasında bir hata oluştu');
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  // İlanın mevcut kullanıcıya ait olup olmadığını kontrol et
  const isOwnListing = state.user && listing?.userId === state.user._id;
  
  const openAppointmentModal = () => {
    if (!isLoggedIn) {
      router.push('/auth/register');
      return;
    }
    
    setAppointmentModalOpen(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
        <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] mx-auto">
          <div className="animate-pulse bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="h-6 sm:h-8 bg-gray-200 rounded mb-3 sm:mb-6 w-1/3"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-4 w-3/4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-4 w-2/3"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-4 w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
        <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] mx-auto">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 mb-4 sm:mb-8 text-center">
            <FiAlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-red-500" />
            <h2 className="text-xl sm:text-2xl font-medium mb-1 sm:mb-2">İlan Bulunamadı</h2>
            <p className="text-gray-600 mb-4 sm:mb-6">{error || 'Bu ilan mevcut değil veya kaldırılmış olabilir.'}</p>
            <button 
              onClick={() => router.push('/')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Kullanıcının giriş yapmadığı durumda açıklamanın ilk 500 karakterini göster
  const truncateDescription = (text: string) => {
    if (isLoggedIn) return text;
    
    if (text.length <= 500) return text;
    
    return text.substring(0, 500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[70%] mx-auto">
        {/* Üst Butonlar */}
        <div className="flex flex-wrap justify-between items-center mb-3 sm:mb-6 gap-2">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-gray-900 text-sm sm:text-base"
          >
            <FiArrowLeft />
            <span>Geri Dön</span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {
              isLoggedIn &&
              <button 
              onClick={handleToggleFavorite}
              disabled={favoriteLoading || !isLoggedIn}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border text-xs sm:text-sm ${
                isFavorite 
                  ? 'bg-red-50 text-red-600 border-red-200' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FiHeart className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
              <span>{isFavorite ? 'İzlemeden Çıkar' : 'İzlemeye Al'}</span>
            </button>
            }
            
            <button 
              onClick={() => isLoggedIn ? openAppointmentModal() : router.push('/auth/register')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm"
            >
              {isLoggedIn ? <FiMessageSquare /> : <FiUserPlus />}
              <span>{isLoggedIn ? 'Randevu Oluştur' : 'Kaydol'}</span>
            </button>
          </div>
        </div>
        
        {/* İlan Başlık */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center justify-between mb-3 sm:mb-6 gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{listing.listingTitle}</h1>
            <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 ${
              listing.isApproved 
                ? 'bg-green-50 text-green-700' 
                : 'bg-yellow-50 text-yellow-700'
            }`}>
              {listing.isApproved 
                ? <><FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Doğrulanmış İlan</> 
                : <><FiAlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" /> Onay Bekliyor</>}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-800 mb-3 sm:mb-6 text-xs sm:text-sm">
            <div>
              <span className="text-gray-700 font-medium">Merkez Lokasyonu:</span> <span className="font-semibold text-gray-900">{listing.location}</span>
            </div>
            <div>
              <span className="text-gray-700 font-medium">Kategori:</span> <span className="font-semibold text-gray-900">{CATEGORY_MAP[listing.category as keyof typeof CATEGORY_MAP] || listing.category}</span>
            </div>
            <div>
              <span className="text-gray-700 font-medium">Kuruluş Tarihi:</span> <span className="font-semibold text-gray-900">{listing.foundingDate}</span>
            </div>
            {isOwnListing && (
              <span className="sm:ml-auto px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                Sizin İlanınız
              </span>
            )}
          </div>
          
          <hr className="my-3 sm:my-6 border-gray-100" />
          
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Açıklama</h2>
          <div className="relative">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {truncateDescription(listing.listingDescription)}
            </p>
            
            {!isLoggedIn && listing.listingDescription.length > 500 && (
              <>
                <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-white to-transparent"></div>
                <div className="absolute bottom-12 sm:bottom-16 left-0 w-full text-center">
                  <button 
                    onClick={() => router.push('/auth/register')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm"
                  >
                    İlanın Tamamını Görmek İçin Şimdi Kaydol
                  </button>
                </div>
                <div className="blur-[12px] mt-4 text-gray-800 leading-relaxed whitespace-pre-line select-none opacity-50">
                  {listing.listingDescription.substring(500)}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* İlan Bilgileri */}
        <div className={`mb-6 sm:mb-10 ${!isLoggedIn ? 'relative' : ''}`}>
          <div className="flex items-center gap-2 mb-3 sm:mb-5">
            <div className="h-8 w-1 bg-blue-600 rounded"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">İlan Detayları</h2>
          </div>
          
          <div className={`${!isLoggedIn ? 'blur-[15px] select-none' : ''}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm p-0.5 mb-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-white">
                  <p className="text-xs font-medium text-gray-500 mb-1">Satış Fiyatı</p>
                  <p className="text-xl font-bold text-blue-700">{listing.price.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Yıllık Ciro</p>
                  <p className="text-xl font-bold text-gray-800">{listing.yearlySales.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Yıllık Kar</p>
                  <p className="text-xl font-bold text-gray-800">{listing.yearlyProfit.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">Müşteri Sayısı</p>
                  <p className="text-xl font-bold text-gray-800">{listing.salesCount.toLocaleString('tr-TR')}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            <InfoCard title="İlan Başlığı" value={listing.listingTitle} />
            <InfoCard title="Kuruluş Tarihi" value={listing.foundingDate} />
            <InfoCard title="Kategori" value={CATEGORY_MAP[listing.category as keyof typeof CATEGORY_MAP] || listing.category} />
            <InfoCard title="Lokasyon" value={listing.location} />
            </div>
          </div>
          
          {!isLoggedIn && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30">
              <button 
                onClick={() => router.push('/auth/register')}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Detayları Görmek İçin Kaydol
              </button>
            </div>
          )}
        </div>
        
        {/* Ek Bilgiler */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-5">
            <div className="h-8 w-1 bg-blue-600 rounded"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Ek Bilgiler</h2>
          </div>
          
            {/* Devir Edilecekler */}
            {Array.isArray(listing.transferItems) && listing.transferItems.length > 0 && (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4 p-4 sm:p-5 border-l-4 border-blue-500">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Devir Edilecekler</h3>
              <div className="flex flex-wrap gap-2">
                {listing.transferItems.map(item => {
                    const map: Record<string, string> = {
                      brand: 'Marka',
                      company: 'Şirket',
                      website: 'Site',
                      social: 'Sosyal Medya Hesapları',
                      operation: 'Operasyon',
                      assets: 'Demirbaşlar ve Tedarikçi Bağlantıları'
                  };
                  const label = map[item] || item;
                  return (
                    <span key={item} className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-sm font-semibold text-gray-900">Temel Bilgiler</h3>
              </div>
              <div className="px-4 py-3 divide-y divide-gray-100">
                {/* Web Sitesi */}
            {listing.websiteUrl && (
                  <div className="py-2 flex justify-between items-center">
                    <p className="text-sm text-gray-600">Web Sitesi</p>
                    <p className="text-sm font-medium text-gray-900">{listing.websiteUrl.length > 10 ? `${listing.websiteUrl.slice(0, 5)}***${listing.websiteUrl.slice(-5)}` : '***'}</p>
                  </div>
            )}
            {/* E-Ticaret Altyapısı */}
            {listing.ecommerceInfrastructure && (
                  <div className="py-2 flex justify-between items-center">
                    <p className="text-sm text-gray-600">E-Ticaret Altyapısı</p>
                    <p className="text-sm font-medium text-gray-900">{listing.ecommerceInfrastructure}</p>
                  </div>
            )}
            {/* Lisans Yenileme Tarihi */}
            {listing.licenseRenewalDate && (
                  <div className="py-2 flex justify-between items-center">
                    <p className="text-sm text-gray-600">Lisans Yenileme Tarihi</p>
                    <p className="text-sm font-medium text-gray-900">{listing.licenseRenewalDate}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-sm font-semibold text-gray-900">Durum Bilgileri</h3>
              </div>
              <div className="px-4 py-3 divide-y divide-gray-100">
            {/* Arama Motoru Engeli */}
            {typeof listing.hasSearchEngineBan !== 'undefined' && (
                  <div className="py-2 flex justify-between items-center">
                    <p className="text-sm text-gray-600">Arama Motoru Engeli</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.hasSearchEngineBan ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {listing.hasSearchEngineBan ? 'Evet' : 'Hayır'}
                    </span>
                  </div>
            )}
            {/* Arama Motoru Engel Detayı */}
            {listing.hasSearchEngineBan && listing.searchEngineBanDetails && (
                  <div className="py-2">
                    <p className="text-sm text-gray-600 mb-1">Engel Detayı</p>
                    <p className="text-sm text-gray-900">{listing.searchEngineBanDetails}</p>
                  </div>
            )}
            {/* Hukuki Engel */}
            {typeof listing.hasLegalObstacles !== 'undefined' && (
                  <div className="py-2 flex justify-between items-center">
                    <p className="text-sm text-gray-600">Hukuki Engel</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.hasLegalObstacles ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {listing.hasLegalObstacles ? 'Evet' : 'Hayır'}
                    </span>
                  </div>
            )}
            {/* Hukuki Engel Detayı */}
            {listing.hasLegalObstacles && listing.legalObstacleDetails && (
                  <div className="py-2">
                    <p className="text-sm text-gray-600 mb-1">Engel Detayı</p>
                    <p className="text-sm text-gray-900">{listing.legalObstacleDetails}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Destek ve Deneyim Bilgileri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Kurucu Deneyimi */}
            {listing.founderExperience && (
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Kurucu Deneyimi</h3>
                <p className="text-sm text-gray-700">{listing.founderExperience}</p>
              </div>
            )}
            
            {/* Satış Sonrası Destek */}
            {typeof listing.willProvideSupport !== 'undefined' && (
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-teal-500">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Satış Sonrası Destek</h3>
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${listing.willProvideSupport ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {listing.willProvideSupport ? 'Evet' : 'Hayır'}
                  </span>
                  
            {listing.willProvideSupport && listing.supportDuration && (
                    <span className="text-xs text-gray-700">
                      Süre: {(() => {
                  const durations = [
                    { value: '1-week', label: '1 Hafta' },
                    { value: '2-week', label: '2 Hafta' },
                    { value: '1-month', label: '1 Ay' },
                    { value: '3-month', label: '3 Ay' },
                    { value: '6-month', label: '6 Ay' },
                    { value: 'custom', label: 'Diğer' }
                  ];
                  const found = durations.find(d => d.value === listing.supportDuration);
                  return found ? found.label : listing.supportDuration;
                })()} 
                    </span>
            )}
                </div>
                
            {listing.willProvideSupport && listing.supportDetails && (
                  <p className="text-sm text-gray-700">{listing.supportDetails}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Sosyal Medya Hesapları */}
          {listing.socialMediaAccounts && Object.values(listing.socialMediaAccounts).some(v => v === true || (typeof v === 'string' && v !== '')) && (
            <div className="mt-4 bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-sm font-semibold text-gray-900">Sosyal Medya Hesapları</h3>
              </div>
              <div className="p-4">
              <div className="flex flex-wrap gap-3">
                {[
                    { key: 'instagram', label: 'Instagram', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg', color: '#E1306C' },
                    { key: 'tiktok', label: 'TikTok', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg', color: '#000000' },
                    { key: 'facebook', label: 'Facebook', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg', color: '#1877F2' },
                    { key: 'twitter', label: 'Twitter', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg', color: '#1DA1F2' },
                    { key: 'youtube', label: 'YouTube', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg', color: '#FF0000' },
                    { key: 'linkedin', label: 'LinkedIn', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg', color: '#0A66C2' }
                  ].map(({ key, label, iconUrl, color }) => (
                  listing.socialMediaAccounts?.[key] ? (
                      <div key={key} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[120px] shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                          <img src={iconUrl} alt={label + ' logo'} className="w-4 h-4" style={{ filter: `invert(0.5) sepia(1) saturate(5) hue-rotate(${color === '#000000' ? '0deg' : 'inherit'})` }} />
                        </div>
                        <div>
                      <span className="font-medium text-gray-900 text-sm">{label}</span>
                      {listing.socialMediaAccounts?.[`${key}Followers`] && (
                            <p className="text-xs text-gray-600">{listing.socialMediaAccounts?.[`${key}Followers`]} takipçi</p>
                      )}
                        </div>
                    </div>
                  ) : null
                ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Pazaryeri Verileri */}
        {listing.hasMarketplaces && (
          <div className={`mb-4 sm:mb-8 ${!isLoggedIn ? 'relative' : ''}`}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Pazaryeri Verileri</h2>
            
            <div className={!isLoggedIn ? 'blur-[15px] select-none' : ''}>
              {/* Satış Dağılımı Pasta Grafiği */}
              <SalesDistributionChart salesData={salesDistributionData} />
              
              <p className="text-sm sm:text-base text-gray-800 mb-3 sm:mb-6">
                Bu işletmenin son 6 aylık pazaryeri satış verileri aşağıda gösterilmektedir.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {/* Trendyol Grafiği */}
                {listing.marketplaces?.includes('trendyol') && (
                  <MarketplaceChart
                    title="Trendyol"
                    monthlySales={listing.trendyolMonthlySales}
                    profitMargin={listing.trendyolProfitMargin}
                    rating={listing.trendyolRating}
                    color="#f27a1a"
                  />
                )}
                
                {/* Hepsiburada Grafiği */}
                {listing.marketplaces?.includes('hepsiburada') && (
                  <MarketplaceChart
                    title="Hepsiburada"
                    monthlySales={listing.hepsiburadaMonthlySales}
                    profitMargin={listing.hepsiburadaProfitMargin}
                    rating={listing.hepsiburadaRating}
                    color="#FF6000"
                  />
                )}
                
                {/* Amazon Grafiği */}
                {listing.marketplaces?.includes('amazon') && (
                  <MarketplaceChart
                    title="Amazon"
                    monthlySales={listing.amazonMonthlySales}
                    profitMargin={listing.amazonProfitMargin}
                    rating={listing.amazonRating}
                    color="#131921"
                  />
                )}
                
                {/* N11 Grafiği */}
                {listing.marketplaces?.includes('n11') && (
                  <MarketplaceChart
                    title="N11"
                    monthlySales={listing.n11MonthlySales}
                    profitMargin={listing.n11ProfitMargin}
                    rating={listing.n11Rating}
                    color="#CC0000"
                  />
                )}
                
                {/* Web Sitesi Grafiği */}
                {listing.hasWebsite && (
                  <MarketplaceChart
                    title="Web Sitesi"
                    monthlySales={listing.websiteMonthlySales}
                    profitMargin={listing.websiteProfitMargin}
                    rating="N/A"
                    color="#4338CA"
                  />
                )}
              </div>
            </div>
            
            {!isLoggedIn && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => router.push('/auth/register')}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs sm:text-sm"
                >
                  Pazaryeri Verilerini Görmek İçin Kaydol
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* İletişim Bölümü */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">İletişime Geç</h2>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-6 border border-blue-100">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Randevu Sistemi Hakkında</h3>
            <p className="text-xs sm:text-sm text-gray-900 mb-2 sm:mb-3">
              Satıcı ile iletişime geçmek için size uygun bir tarih ve saat seçerek randevu oluşturabilirsiniz. Randevu oluşturduğunuzda:
            </p>
            <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-900">
              <li>Randevu bilgileriniz e-posta adresinize gönderilecektir</li>
              <li>Satıcı, randevunuzu onayladığında bilgilendirileceksiniz</li>
              <li>Randevu saatinde satıcı sizinle iletişime geçecektir</li>
              <li>Satın alma sürecine başlamak için ek bilgilere ihtiyaç duyarsanız, randevu notlarında belirtebilirsiniz</li>
            </ul>
          </div>
          <button 
            onClick={() => isLoggedIn ? openAppointmentModal() : router.push('/auth/register')}
            className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 sm:gap-2 font-medium text-xs sm:text-sm"
          >
            <FiMessageSquare />
            <span>{isLoggedIn ? 'Randevu Oluştur' : 'İletişime Geçmek İçin Kaydol'}</span>
          </button>
        </div>
        
        {/* Soru ve Cevap Bölümü */}
        <QuestionAnswerSection 
          listingId={id} 
          isListingOwner={isOwnListing || false}
        />
        
        {/* Randevu Modal */}
        {listing && (
          <AppointmentModal 
            isOpen={appointmentModalOpen} 
            onClose={() => setAppointmentModalOpen(false)} 
            listingId={listing._id} 
          />
        )}
      </div>
    </div>
  );
} 