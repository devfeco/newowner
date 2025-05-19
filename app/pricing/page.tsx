'use client'

import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PricingSection from './components/PricingSection'
import FeatureComparisonTable from './components/FeatureComparisonTable'
import FAQSection from './components/FAQSection'
import logo from "@/public/images/newowner-logo.png"

// Buton stil varyantları için yardımcı sınıf
const buttonStyles = {
  primary: "bg-indigo-600 text-white font-medium rounded-full transition-all duration-300 hover:bg-indigo-700 flex items-center justify-center px-8 py-3 cursor-pointer",
  secondary: "bg-white text-indigo-600 border border-indigo-600 font-medium rounded-full transition-all duration-300 hover:bg-gray-50 flex items-center justify-center px-8 py-3 cursor-pointer",
  small: "text-sm px-7 py-2.5",
  medium: "px-8 py-3",
  large: "text-base px-9 py-3.5",
  icon: "gap-3"
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-5 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/">
              <Image src={logo} alt="Newowner" width={150} height={150} />
            </Link>
          </div>
          
          {/* Ana Menü */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-indigo-600 hover:text-indigo-700 font-medium transition duration-200">
              Fiyatlar
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium transition duration-200">
              Hakkımızda
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/auth/register">
              <button className={`${buttonStyles.primary} ${buttonStyles.icon} px-6 py-2.5 text-sm`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Üye Ol</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute -left-20 -top-20 w-40 h-40 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-100 rounded-full filter blur-3xl opacity-50"></div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                Şeffaf <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Fiyatlandırma</span>
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mb-10">
              İster alıcı, ister satıcı olun - işinizi büyütmenize yardımcı olacak doğru planı seçin
            </p>
          </div>
        </div>
        
        {/* Blob animasyonları */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-32 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <PricingSection />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-indigo-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
              Özellik Karşılaştırması
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              İhtiyaçlarınıza en uygun planı seçin
            </p>
          </div>
          
          <FeatureComparisonTable />
        </div>
      </section>

      {/* Listeleme Hizmet Bedeli Bilgilendirme */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-10 sm:p-12 text-center text-white relative">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Listeleme Hizmet Bedeli</h2>
              <p className="text-xl sm:text-2xl text-indigo-100 mb-6 max-w-3xl mx-auto">
                Başarılı olarak satışı gerçekleştirilen tüm marka ve operasyonlardan hem alıcı hem de satıcıdan <span className="font-bold text-white">%5 listeleme hizmet bedeli</span> alınmaktadır.
              </p>
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-4 border border-white/20">
                <p className="text-lg text-white">
                  Bu bedel, güvenli işlem süreci, aracılık hizmetleri ve platform desteğini kapsamaktadır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-indigo-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-10 right-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-10 sm:p-16 text-center text-white relative">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Hemen Başlayın</h2>
              <p className="text-xl sm:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
                Ücretsiz hesap oluşturun ve binlerce iş fırsatına göz atın veya premium ile daha fazla avantaj elde edin.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/register">
                  <button className={`${buttonStyles.secondary} px-8 py-3.5 text-base`}>
                    <span>Ücretsiz Başla</span>
                  </button>
                </Link>
                <Link href="#pricing">
                  <button className={`${buttonStyles.primary} px-8 py-3.5 text-base hover:bg-gray-100 text-indigo-700`}>
                    <span>Premium Üyelik Al</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 