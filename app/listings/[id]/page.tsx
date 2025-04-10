'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import { FiArrowLeft, FiHeart, FiMessageSquare, FiShare2, FiAlertTriangle, FiCheckCircle, FiUserPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import MarketplaceChart from '@/app/components/ui/MarketplaceChart';
import SalesDistributionChart from '@/app/components/ui/SalesDistributionChart';

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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm text-gray-700 font-medium mb-1">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">
        {prefix}{typeof value === 'number' ? value.toLocaleString('tr-TR') : value}{suffix}
      </p>
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="w-[70%] mx-auto">
          <div className="animate-pulse bg-white rounded-xl p-8 mb-8">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="w-[70%] mx-auto">
          <div className="bg-white rounded-xl p-8 mb-8 text-center">
            <FiAlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-medium mb-2">İlan Bulunamadı</h2>
            <p className="text-gray-600 mb-6">{error || 'Bu ilan mevcut değil veya kaldırılmış olabilir.'}</p>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[70%] mx-auto">
        {/* Üst Butonlar */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <FiArrowLeft />
            <span>Geri Dön</span>
          </button>
          
          <div className="flex items-center gap-4">
            {
              isLoggedIn &&
              <button 
              onClick={handleToggleFavorite}
              disabled={favoriteLoading || !isLoggedIn}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
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
              onClick={() => isLoggedIn ? null : router.push('/auth/register')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoggedIn ? <FiMessageSquare /> : <FiUserPlus />}
              <span>{isLoggedIn ? 'İletişime Geç' : 'Kaydol'}</span>
            </button>
          </div>
        </div>
        
        {/* İlan Başlık */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{listing.brandName}</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
              listing.isApproved 
                ? 'bg-green-50 text-green-700' 
                : 'bg-yellow-50 text-yellow-700'
            }`}>
              {listing.isApproved 
                ? <><FiCheckCircle /> Doğrulanmış İlan</> 
                : <><FiAlertTriangle /> Onay Bekliyor</>}
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-gray-800 mb-6 text-sm">
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
              <span className="ml-auto px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                Sizin İlanınız
              </span>
            )}
          </div>
          
          <hr className="my-6 border-gray-100" />
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Açıklama</h2>
          <div className="relative">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {truncateDescription(listing.listingDescription)}
            </p>
            
            {!isLoggedIn && listing.listingDescription.length > 500 && (
              <>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
                <div className="absolute bottom-50 left-0 w-full text-center">
                  <button 
                    onClick={() => router.push('/auth/register')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transition-all"
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
        <div className={`mb-8 ${!isLoggedIn ? 'relative' : ''}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">İlan Detayları</h2>
          <div className={`grid grid-cols-4 gap-4 ${!isLoggedIn ? 'blur-[15px] select-none' : ''}`}>
            <InfoCard title="Marka Adı" value={listing.brandName} />
            <InfoCard title="Kuruluş Tarihi" value={listing.foundingDate} />
            <InfoCard title="Kategori" value={CATEGORY_MAP[listing.category as keyof typeof CATEGORY_MAP] || listing.category} />
              <InfoCard title="Lokasyon" value={listing.location} />
            <InfoCard title="Satış Fiyatı" value={listing.price} prefix="" suffix=" ₺" />
            <InfoCard title="Yıllık Ciro" value={listing.yearlySales} prefix="" suffix=" ₺" />
            <InfoCard title="Yıllık Kar" value={listing.yearlyProfit} prefix="" suffix=" ₺" />
            <InfoCard title="Müşteri Sayısı" value={listing.salesCount} />
          </div>
          
          {!isLoggedIn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => router.push('/auth/register')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Detayları Görmek İçin Kaydol
              </button>
            </div>
          )}
        </div>
        
        {/* Pazaryeri Verileri */}
        {listing.hasMarketplaces && (
          <div className={`mb-8 ${!isLoggedIn ? 'relative' : ''}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pazaryeri Verileri</h2>
            
            <div className={!isLoggedIn ? 'blur-[15px] select-none' : ''}>
              {/* Satış Dağılımı Pasta Grafiği */}
              <SalesDistributionChart salesData={salesDistributionData} />
              
              <p className="text-gray-800 mb-6">
                Bu işletmenin son 6 aylık pazaryeri satış verileri aşağıda gösterilmektedir.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Pazaryeri Verilerini Görmek İçin Kaydol
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* İletişim Bölümü */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">İletişime Geç</h2>
          <p className="text-gray-800 mb-6">
            Bu işletme hakkında daha fazla bilgi almak veya satın alma sürecini başlatmak için satıcı ile iletişime geçin.
          </p>
          <button 
            onClick={() => isLoggedIn ? null : router.push('/auth/register')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
          >
            <FiMessageSquare />
            <span>{isLoggedIn ? 'Satıcıyla İletişime Geç' : 'İletişime Geçmek İçin Kaydol'}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 