'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from "@/public/images/newowner-logo.png"
import logowite from "@/public/images/newowner-logo-white.png"
import dashboard from "@/public/images/dashboard.png"

// Buton stil varyantları için yardımcı sınıf
const buttonStyles = {
  primary: "bg-blue-600 text-white font-medium rounded-full transition-all duration-300 hover:bg-blue-700 flex items-center justify-center px-8 py-3 cursor-pointer",
  secondary: "bg-white text-blue-600 border border-blue-600 font-medium rounded-full transition-all duration-300 hover:bg-gray-50 flex items-center justify-center px-8 py-3 cursor-pointer",
  small: "text-sm px-7 py-2.5",
  medium: "px-8 py-3",
  large: "text-base px-9 py-3.5",
  icon: "gap-3"
};

export default function LandingPage() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };
  
  const faqData = [
    {
      question: "E-ticaret şirketimi satmak için minimum hangi şartları sağlamalıyım?",
      answer: "Platformumuzda şirketinizi satmak için en az 6 aylık faaliyet geçmişine, detaylı satış verilerine ve yasal olarak geçerli bir işletmeye sahip olmanız gerekir. Şirketinizin aylık en az 10.000 TL gelir üretmesi tercih edilir."
    },
    {
      question: "Şirket satış sürecinde anonimliğimi koruyabilir miyim?",
      answer: "Evet, istediğiniz takdirde anonim kalabilirsiniz. Potansiyel alıcılarla temel bilgiler paylaşılır, ancak şirket adı ve kişisel bilgileriniz, ciddi ilgi ve bir gizlilik anlaşması imzalanana kadar gizli tutulabilir."
    },
    {
      question: "Newowner hangi ödeme modellerini kullanıyor?",
      answer: "Platformumuzda peşin, taksitli ve kazanca dayalı (earn-out) ödeme modelleri kullanılmaktadır. Alıcı ve satıcı arasında anlaşılan ödeme planı, güvenli ödeme sistemimiz üzerinden gerçekleştirilir."
    },
    {
      question: "Bir e-ticaret şirketi satın aldıktan sonra devir işlemleri nasıl yürütülür?",
      answer: "Satın alma işlemi onaylandıktan sonra, ekibimiz tüm dijital varlıkların, web sitesinin, sosyal medya hesaplarının, tedarikçi ve müşteri ilişkilerinin devri için size özel bir geçiş planı hazırlar ve süreç boyunca her adımda destek sağlar."
    },
    {
      question: "Finansal değerleme için hangi yöntemler kullanılıyor?",
      answer: "Şirketinizin değerlemesinde genellikle gelir temelli yaklaşım (EBITDA çarpanları), pazar temelli yaklaşım (benzer satışların karşılaştırılması) ve varlık temelli yaklaşım gibi çeşitli metodolojiler bir arada kullanılarak gerçekçi bir piyasa değeri belirlenir."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-5 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Image src={logo} alt="Newowner" width={150} height={150} />
          </div>
          
          {/* Ana Menü */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition duration-200">
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
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
              <div className="relative">
                <div className="absolute -left-10 -top-20 w-40 h-40 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>
                <div className="absolute -right-10 bottom-0 w-32 h-32 bg-purple-100 rounded-full filter blur-3xl opacity-50"></div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                  E-Ticaret Şirketinizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Alın</span> veya <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Satın</span>
                </h1>
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mb-10">
                E-Ticarete başlamanın en jızlı yolu.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 bg-red">
                <Link href="/auth/register">
                <button className={`${buttonStyles.secondary} px-8 py-3.5 text-base`}>
                  <span>Şimdi Keşfet</span>
                </button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              {/* Hero görsel alanı */}
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-10 -left-10 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-10 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-10 left-20 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="relative w-full h-96 bg-gray-50 rounded-2xl shadow-xl overflow-hidden justify-center items-center">
                    <Image src={dashboard} alt="Dashboard" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          @keyframes pulse-slow {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.9;
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </section>

      {/* Nasıl Çalışır */}
      <section id="nasil-calisir" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-indigo-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
              Nasıl Çalışır?
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Şirketinizi satmak veya yeni bir şirket satın almak hiç bu kadar kolay olmamıştı
            </p>
          </div>
          
          <div className="relative">
            {/* Bağlantı çizgisi - mobil için */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 via-purple-400 to-indigo-300 transform -translate-x-1/2 md:hidden"></div>
            
            {/* Bağlantı çizgisi - desktop için */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-300 via-purple-500 to-indigo-300 transform -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
              {/* Adım 1 */}
              <div className="relative z-10 group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-70 scale-[1.15] group-hover:scale-[1.25] group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200/50 transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 relative z-10">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 animate-pulse-gentle opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="transform transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Kayıt Ol</h3>
                    <p className="text-gray-600">
                      Hızlı kayıt süreciyle platformumuza üye olun ve hemen işlemlere başlayın
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Adım 2 */}
              <div className="relative z-10 group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-70 scale-[1.15] group-hover:scale-[1.25] group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200/50 transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 relative z-10">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 animate-pulse-gentle opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="transform transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Şirket Ekle</h3>
                    <p className="text-gray-600">
                      E-ticaret şirketinizin tüm detaylarını ve finansal bilgilerini sisteme ekleyin
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Adım 3 */}
              <div className="relative z-10 group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-70 scale-[1.15] group-hover:scale-[1.25] group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200/50 transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 relative z-10">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 animate-pulse-gentle opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="transform transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Doğrulama</h3>
                    <p className="text-gray-600">
                      Uzman ekibimiz şirket verilerinizi inceleyip doğrulayarak ilana hazırlar
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Adım 4 */}
              <div className="relative z-10 group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-70 scale-[1.15] group-hover:scale-[1.25] group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200/50 transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 relative z-10">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 animate-pulse-gentle opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="transform transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Satış</h3>
                    <p className="text-gray-600">
                      Dijital varlıkların transfer protokolüyle şirketinizin devir işlemlerini güvenli bir şekilde gerçekleştirin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-20">
            <Link href="/auth/register">
              <button className={`${buttonStyles.primary} ${buttonStyles.icon} px-8 py-3 group relative overflow-hidden`}>
                <span className="relative z-10">Hemen Başla</span>
                <div className="absolute inset-0 bg-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
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
          
          @keyframes pulse-gentle {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            50% {
              opacity: 0.5;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.95);
            }
          }
          
          .animate-blob {
            animation: blob 12s infinite linear;
          }
          
          .animate-pulse-gentle {
            animation: pulse-gentle 2s infinite ease-in-out;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </section>

      {/* Öne Çıkan Şirketler */}
      <section id="sirketler" className="py-24 sm:py-32 bg-gradient-to-b from-white to-indigo-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
                Öne Çıkan Şirketler
                <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
              </h2>
              <p className="mt-6 text-xl text-gray-600">
                Satıştaki en iyi e-ticaret şirketlerini keşfedin
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link href="/listings">
                <button className={`${buttonStyles.secondary} ${buttonStyles.icon} px-7 py-3`}>
                  <span>Tüm Şirketleri Gör</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
          
          {/* Şirket Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Şirket Kartı 1 */}
            <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200">
              {/* Arka plan dekoratif elementi */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-70 transition-all duration-500 group-hover:scale-125"></div>
              
              <div className="p-7 relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">Mobilya E-Ticaret Sitesi</h3>
                    <p className="text-sm text-gray-500 mt-1">Modern ev eşyaları satışı</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                    Mobilya
                  </span>
                </div>
                
                <div className="space-y-4 mb-7">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Yıllık Ciro:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">₺2.5M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Net Kâr:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">₺650K</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Kuruluş:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">2020</span>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">₺4.5M</div>
                  <button className="group relative px-5 py-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="relative z-10 flex items-center">
                      <span className="mr-2">İncele</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full scale-x-0 transform bg-indigo-600 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Şirket Kartı 2 */}
            <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200">
              {/* Arka plan dekoratif elementi */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-70 transition-all duration-500 group-hover:scale-125"></div>
              
              <div className="p-7 relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">Kozmetik Markası</h3>
                    <p className="text-sm text-gray-500 mt-1">Organik cilt bakım ürünleri</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 shadow-sm">
                    Güzellik
                  </span>
                </div>
                
                <div className="space-y-4 mb-7">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Yıllık Ciro:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">₺1.8M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Net Kâr:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">₺480K</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Kuruluş:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">2021</span>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">₺3.2M</div>
                  <button className="group relative px-5 py-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="relative z-10 flex items-center">
                      <span className="mr-2">İncele</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full scale-x-0 transform bg-indigo-600 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Şirket Kartı 3 */}
            <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200">
              {/* Arka plan dekoratif elementi */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-0 group-hover:opacity-70 transition-all duration-500 group-hover:scale-125"></div>
              
              <div className="p-7 relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">Elektronik Dükkanı</h3>
                    <p className="text-sm text-gray-500 mt-1">Akıllı ev sistemleri tedarikçisi</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm">
                    Elektronik
                  </span>
                </div>
                
                <div className="space-y-4 mb-7">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Yıllık Ciro:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">₺5.1M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Net Kâr:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">₺820K</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium">Kuruluş:</span>
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">2019</span>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">₺6.8M</div>
                  <button className="group relative px-5 py-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="relative z-10 flex items-center">
                      <span className="mr-2">İncele</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </div>
                    <div className="absolute top-0 left-0 h-full w-full scale-x-0 transform bg-indigo-600 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neden Biz / Avantajlar */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
              Neden Newowner?
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              E-ticaret şirketinizi satarken veya satın alırken fark yaratan avantajlarımız
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Güvenli İşlem</h3>
              <p className="text-gray-600">
                Alıcı ve satıcı arasındaki tüm işlemler, özel güvenli ödeme sistemimiz üzerinden gerçekleştirilir. Paranız, satış tamamlanana kadar korunur.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detaylı Değerleme</h3>
              <p className="text-gray-600">
                Uzman ekibimiz, şirketinizin gerçek değerini belirlemek için kapsamlı bir finansal değerlendirme yaparak en uygun fiyatı bulmanıza yardımcı olur.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı Süreç</h3>
              <p className="text-gray-600">
                Geleneksel yöntemlerin aksine, Newowner sayesinde şirketiniz ortalama 45 gün içinde satışa çıkabilir ve başarılı bir şekilde el değiştirebilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-indigo-50 to-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-50"></div>
          
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
              Müşterilerimizin Yorumları
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Platformumuzdan şirket satan ve satın alan müşterilerimizin deneyimleri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative">
              <div className="absolute top-4 right-4 text-5xl text-indigo-100 font-serif">"</div>
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-200">
                  AY
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Ahmet Yılmaz</h4>
                  <p className="text-sm text-indigo-600 font-medium">Satıcı, Bebek Ürünleri E-Ticaret</p>
                </div>
              </div>
              <p className="text-gray-600 relative z-10">
                "Newowner'ın değerleme süreci ve müşteri bulma konusundaki uzmanlığı sayesinde şirketimi beklediğimden %20 daha yüksek bir fiyata satabildim. Profesyonel yaklaşımlarından çok memnunum."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative">
              <div className="absolute top-4 right-4 text-5xl text-indigo-100 font-serif">"</div>
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-200">
                  SÖ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Selin Öztürk</h4>
                  <p className="text-sm text-indigo-600 font-medium">Alıcı, Aksesuar Mağazası</p>
                </div>
              </div>
              <p className="text-gray-600 relative z-10">
                "E-ticaret dünyasına giriş yapmak için bir şirket arıyordum ve Newowner tam ihtiyacım olan şirketi bulmama yardımcı oldu. Şeffaf süreç ve güvenli ödeme sistemi beni çok rahatlattı."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative">
              <div className="absolute top-4 right-4 text-5xl text-indigo-100 font-serif">"</div>
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-200">
                  MK
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Murat Kaya</h4>
                  <p className="text-sm text-indigo-600 font-medium">Satıcı, Spor Malzemeleri</p>
                </div>
              </div>
              <p className="text-gray-600 relative z-10">
                "6 yıl boyunca e-ticaret işim için emek verdim ve doğru kişiye devretmek önemliydi. Newowner ile sadece 38 günde şirketimi satmayı başardım ve şimdi yeni projelerime odaklanıyorum."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white to-indigo-50/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-indigo-100 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
              Sıkça Sorulan Sorular
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform translate-y-2"></div>
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              E-ticaret şirketinizin satışı hakkında merak ettikleriniz
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl overflow-hidden ${
                  activeQuestion === index ? 'border-indigo-300 shadow-indigo-100/50' : ''
                }`}
              >
                <button 
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-0 transition-all group"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-center">
                    <div className={`h-10 w-10 mr-4 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-500 ${
                      activeQuestion === index 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-md shadow-indigo-200/50' 
                        : 'bg-indigo-100 text-indigo-500'
                    }`}>
                      <span className="font-semibold text-lg">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      activeQuestion === index ? 'text-indigo-700' : 'text-gray-900 group-hover:text-indigo-600'
                    }`}>{faq.question}</h3>
                  </div>
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full bg-indigo-50 flex items-center justify-center transform transition-all duration-500 ${
                    activeQuestion === index 
                      ? 'rotate-180 bg-indigo-100' 
                      : 'group-hover:bg-indigo-100/80'
                  }`}>
                    <svg 
                      className={`w-5 h-5 transition-all duration-300 ${
                        activeQuestion === index ? 'text-indigo-700' : 'text-indigo-500'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ${
                    activeQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-2 pb-8 text-gray-600 border-t border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
                    <div className="ml-14">
                      <div className="relative">
                        <div className="absolute top-0 left-0 -ml-14 h-full w-[2px] bg-gradient-to-b from-indigo-300 to-purple-400"></div>
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/auth/register">
              <button className={`${buttonStyles.primary} ${buttonStyles.icon} px-8 py-3.5 text-base group relative overflow-hidden`}>
                <span className="relative z-10">Daha Fazla Bilgi</span>
                <div className="absolute inset-0 bg-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-900 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-900 rounded-full filter blur-3xl opacity-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <Image src={logowite} alt="Newowner" width={100} height={100} />
              <p className="mb-6 text-gray-400 leading-relaxed">
                E-Ticaret'e başlamanın hızlı yolu
              </p>
              <div className="flex space-x-5">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 9.128 6.839 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Hızlı Erişim</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Anasayfa</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Fiyatlar</Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Hakkımızda</Link>
                </li>
              </ul>
            </div>
            
            <div className="hidden">
              <h4 className="text-white font-bold mb-6 text-lg">Kaynaklar</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Yardım Merkezi</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Şirket Değerleme Rehberi</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Webinarlar</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Yasal Belgeler</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">E-Kitaplar</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">İletişim</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 mt-1">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-400">Levent, İstanbul</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 mt-1">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-400">iletisim@Newowner.com</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 mt-1">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-400">0850 123 45 67</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 mt-1">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-400">Pazartesi - Cuma: 09:00 - 18:00</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 mt-8">
            <div className="md:flex md:justify-between items-center">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Newowner. Tüm hakları saklıdır.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 text-sm">Gizlilik Politikası</Link>
                <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 text-sm">Kullanım Koşulları</Link>
                <Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 text-sm">Çerez Politikası</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 