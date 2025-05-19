'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { state } = useAuth();
  const searchParams = useSearchParams();
  
  const planType = searchParams.get('plan');
  const isAnnual = planType === 'annual';
  
  // Fiyat hesaplaması
  const premiumMonthlyPrice = 39;
  const premiumAnnualPrice = 360;
  const planAmount = isAnnual ? premiumAnnualPrice : premiumMonthlyPrice;
  const planLabel = isAnnual ? 'Yıllık Premium' : 'Aylık Premium';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Geçersiz plan parametresi varsa pricing sayfasına yönlendir
    if (planType !== 'annual' && planType !== 'monthly') {
      router.push('/pricing');
      return;
    }
    
    // Kullanıcı giriş yapmamışsa oturum açma sayfasına yönlendir
    if (!state.isAuthenticated && !state.isLoading) {
      router.push('/auth/login?callbackUrl=/payments/checkout?plan=' + planType);
      return;
    }
    
    if (state.isAuthenticated && state.user) {
      // Ödeme başlatma isteği gönder
      initializePayment();
    }
  }, [state.isAuthenticated, state.isLoading, state.user, planType, router]);
  
  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Form verileri
      const paymentData = {
        isAnnual,
        amount: planAmount,
        planType: planType,
        address: 'Varsayılan Adres', // Bu bilgiyi kullanıcı profilinden alabiliriz
        phone: '+90*********' // Bu bilgiyi kullanıcı profilinden alabiliriz
      };
      
      // Token'ı al
      const token = localStorage.getItem('token');
      
      // API'ye istek gönder
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(paymentData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ödeme başlatılırken bir hata oluştu');
      }
      
      // iFrame URL'sini ayarla
      setIframeUrl(data.iframeUrl);
    } catch (err: any) {
      setError(err.message || 'Ödeme başlatılırken bir hata oluştu');
      console.error('Ödeme başlatma hatası:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (state.isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Ödeme sayfası hazırlanıyor...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="mt-2 text-lg font-medium text-gray-900">Hata Oluştu</h2>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
            </div>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Fiyatlandırma Sayfasına Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!iframeUrl) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Üst bilgi */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link
                href="/pricing"
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                <span>Geri Dön</span>
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-medium text-gray-900">{planLabel}</h1>
              <p className="text-sm text-gray-600">${planAmount}</p>
            </div>
            <div className="w-16"></div> {/* Boşluk dengeleme */}
          </div>
        </div>
      </div>
      
      {/* iFrame içeriği */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white shadow rounded-lg overflow-hidden">
          <iframe
            src={iframeUrl}
            frameBorder="0"
            scrolling="no"
            width="100%"
            height="600px"
            className="block w-full"
          ></iframe>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          PayTR güvenli ödeme altyapısı kullanılmaktadır.
        </div>
      </div>
    </div>
  );
} 