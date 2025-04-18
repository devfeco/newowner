'use client'

import React, { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

// Buton stil varyantları için yardımcı sınıf
const buttonStyles = {
  primary: "bg-indigo-600 text-white font-medium rounded-full transition-all duration-300 hover:bg-indigo-700 flex items-center justify-center px-8 py-3 cursor-pointer",
  secondary: "bg-white text-indigo-600 border border-indigo-600 font-medium rounded-full transition-all duration-300 hover:bg-gray-50 flex items-center justify-center px-8 py-3 cursor-pointer",
  premium: "bg-white text-indigo-700 font-medium rounded-full transition-all duration-300 hover:bg-gray-50 flex items-center justify-center px-8 py-3 cursor-pointer w-full",
  free: "bg-transparent border-2 border-gray-200 text-gray-700 font-medium rounded-full transition-all duration-300 hover:bg-gray-50 flex items-center justify-center px-8 py-3 cursor-pointer w-full",
};

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)
  
  // İndirim bilgisi
  const promoEndsDate = '30 Eylül 2023'
  const discountPercentage = 50
  
  // Fiyat hesaplaması
  const premiumMonthlyPrice = 39
  const premiumAnnualPrice = 360
  
  const monthlyWithDiscount = premiumMonthlyPrice * (1 - discountPercentage / 100)
  const annualWithDiscount = premiumAnnualPrice * (1 - discountPercentage / 100)
  
  const displayedMonthlyPrice = isAnnual ? (annualWithDiscount / 12).toFixed(2) : monthlyWithDiscount.toFixed(2)
  const displayedAnnualPrice = annualWithDiscount.toFixed(2)
  
  return (
    <div>
      <div className="text-center mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
          Planları Karşılaştırın
          <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
        </h2>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          İhtiyacınıza ve bütçenize uygun planı seçin. Tüm planlarda kesintisiz destek ve güncellemeler dahildir.
        </p>
      </div>
      
      {/* Billing Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-gray-100 p-1.5 rounded-full">
          <div className="flex items-center">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual ? 'bg-white shadow-md text-indigo-700' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Aylık Ödeme
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isAnnual ? 'bg-white shadow-md text-indigo-700' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Yıllık Ödeme
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                %20 TASARRUF
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-8 sm:p-10">
            <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ücretsiz</h3>
            <p className="text-gray-600 mb-6">Hemen başlamak ve platformu keşfetmek için</p>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-extrabold text-gray-900">₺0</span>
              <span className="text-gray-500 ml-2 text-lg">/ her zaman</span>
            </div>
            
            <Link href="/auth/register">
              <button className={buttonStyles.free}>
                Ücretsiz Başla
              </button>
            </Link>
            
            <div className="mt-10 space-y-5">
              <Feature text="İlan görüntüleme" />
              <Feature text="Temel profil oluşturma" />
              <Feature text="İşlemlerinizi izleme" />
              <Feature text="Destek sistemi" />
              <Feature text="Yayınlanan tüm ilanları keşfetme" />
            </div>
          </div>
        </div>
        
        {/* Premium Plan */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:scale-105">
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
          <div className="p-8 sm:p-10 relative z-10">
            <div className="bg-white/15 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            
            <div className="absolute top-10 right-10">
              <div className="bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                %{discountPercentage} İndirim
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-indigo-100 mb-6">Profesyonel alıcı ve satıcılar için</p>
            
            <div className="flex items-baseline mb-2">
              <span className="text-5xl font-extrabold text-white">${displayedMonthlyPrice}</span>
              <span className="text-indigo-200 ml-2 text-lg">/ ay</span>
            </div>
            
            {isAnnual && (
              <p className="text-indigo-200 mb-8">
                Yıllık ${displayedAnnualPrice} ödeme (${(premiumAnnualPrice / 12).toFixed(2)}/ay yerine)
              </p>
            )}
            
            <p className="text-yellow-300 text-sm font-medium mb-8">
              *İndirimli fiyat {promoEndsDate} tarihine kadar geçerlidir
            </p>
            
            <Link href="/auth/register?plan=premium">
              <button className={buttonStyles.premium}>
                Premium'a Yükselt
              </button>
            </Link>
            
            <div className="mt-10 space-y-5">
              <Feature text="Ücretsiz plan özellikleri" theme="dark" />
              <Feature text="İlan detaylarına tam erişim" theme="dark" />
              <Feature text="Operasyon verilerine erişim" theme="dark" />
              <Feature text="Öncelikli bildirimler" theme="dark" />
              <Feature text="Aracılık hizmetleri" theme="dark" />
              <Feature text="İşlemlerde öncelik" theme="dark" />
              <Feature text="7/24 Premium destek" theme="dark" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Add-on Information */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          * Tüm fiyatlar USD olarak belirtilmiştir. Ödemeler PAYTR aracılığıyla yapılmaktadır.
          <br />
          İptal işlemi herhangi bir zamanda gerçekleştirilebilir.
        </p>
      </div>
    </div>
  )
}

type FeatureProps = {
  text: string
  isDisabled?: boolean
  theme?: 'light' | 'dark'
}

function Feature({ text, isDisabled = false, theme = 'light' }: FeatureProps) {
  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 h-5 w-5 ${isDisabled ? (theme === 'dark' ? 'text-indigo-400' : 'text-gray-400') : (theme === 'dark' ? 'text-green-400' : 'text-green-500')}`}>
        <CheckIcon />
      </div>
      <p className={`ml-3 ${isDisabled ? (theme === 'dark' ? 'text-indigo-300' : 'text-gray-400') : (theme === 'dark' ? 'text-indigo-50' : 'text-gray-600')}`}>
        {text}
      </p>
    </div>
  )
} 