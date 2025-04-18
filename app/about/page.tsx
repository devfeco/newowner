'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiChevronRight, FiTwitter, FiLinkedin, FiInstagram, FiCheck, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import logo from "@/public/images/newowner-logo.png"
import logowite from "@/public/images/newowner-logo-white.png"

// Buton stil varyantları için yardımcı sınıf
const buttonStyles = {
  primary: "bg-indigo-600 text-white font-medium rounded-full transition-all duration-300 hover:bg-indigo-700 flex items-center justify-center px-8 py-3 cursor-pointer",
  secondary: "bg-white text-indigo-600 border border-indigo-600 font-medium rounded-full transition-all duration-300 hover:bg-gray-50 flex items-center justify-center px-8 py-3 cursor-pointer",
  small: "text-sm px-7 py-2.5",
  medium: "px-8 py-3",
  large: "text-base px-9 py-3.5",
  icon: "gap-3"
};

export default function AboutPage() {
  const router = useRouter()
  const missionRef = useRef<HTMLElement>(null)
  
  const scrollToMission = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    missionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
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
            <Link href="/pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition duration-200">
              Fiyatlar
            </Link>
            <Link href="/about" className="text-indigo-600 hover:text-indigo-700 font-medium transition duration-200">
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
                Biz <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Kimiz?</span>
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mb-10">
              Dijital varlık alım satımında yenilikçi yaklaşımımızla öne çıkıyoruz
            </p>
            <a 
              href="#mission"
              onClick={scrollToMission}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              Hakkımızda Daha Fazla
              <FiChevronRight className="ml-2" />
            </a>
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
      
      {/* Mission Section */}
      <section ref={missionRef} id="mission" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Misyonumuz & Vizyonumuz</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700">
              NewOwner, dijital varlıkların güvenli ve kolay bir şekilde alım satımını sağlayan yenilikçi bir platformdur. 
              Misyonumuz, alıcılar ve satıcılar arasında şeffaf, güvenilir ve verimli bir pazar yeri oluşturmaktır.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h3>
              <p className="text-gray-700 mb-4">
                E-ticaret dünyasında alıcı ve satıcılar arasında güvenilir bir köprü olmak, işlem süreçlerini basitleştirmek ve herkes için erişilebilir kılmak.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Güvenli işlem platformu sunmak</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Şeffaf değerleme sistemi sağlamak</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Kullanıcı dostu arayüz geliştirmek</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h3>
              <p className="text-gray-700 mb-4">
                Dijital varlık ticaretinde lider platform olmak ve kullanıcılarımıza en iyi deneyimi sunmak için sürekli yenilik yapmak.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Sektörde öncü teknolojiyi kullanmak</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Sürekli büyüyen bir ekosistem yaratmak</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="mt-1 mr-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Kullanıcı deneyimini sürekli iyileştirmek</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Harika Ekibimiz</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700">
              NewOwner'ın başarısının arkasında tutkulu ve uzman bir ekip var
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="aspect-[3/4] bg-gradient-to-b from-blue-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">AA</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-6 w-full">
                    <div className="flex justify-center space-x-3">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiTwitter className="text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiLinkedin className="text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiMail className="text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Gökhan Tanrıverdi</h3>
              <p className="text-blue-600 font-medium mb-2">Kurucu & CEO</p>
              <p className="text-gray-600 text-sm">
                10+ yıllık e-ticaret deneyimiyle dijital varlık alım satımında uzman, girişimci ruhuyla NewOwner'ı kurdu.
              </p>
            </div>
            
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="aspect-[3/4] bg-gradient-to-b from-blue-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">MY</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-6 w-full">
                    <div className="flex justify-center space-x-3">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiTwitter className="text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiLinkedin className="text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiMail className="text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Mehmet Yılmaz</h3>
              <p className="text-blue-600 font-medium mb-2">Teknoloji Direktörü</p>
              <p className="text-gray-600 text-sm">
                Fintech alanında uzman yazılım mühendisi, blockchain ve e-ticaret teknolojilerinde derin bilgiye sahip.
              </p>
            </div>
            
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="aspect-[3/4] bg-gradient-to-b from-blue-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">AK</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-6 w-full">
                    <div className="flex justify-center space-x-3">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiTwitter className="text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiLinkedin className="text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                        <FiMail className="text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Ayşe Kaya</h3>
              <p className="text-blue-600 font-medium mb-2">Pazarlama Direktörü</p>
              <p className="text-gray-600 text-sm">
                Kullanıcı deneyimi ve dijital pazarlama alanında 8 yıldan fazla deneyime sahip, yaratıcı stratejist.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700">
              İşimizi yaparken bizi yönlendiren temel prensipler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <FiCheck />
                </span>
                Güvenilirlik ve Şeffaflık
              </h3>
              <p className="text-gray-700 ml-13">Tüm işlemlerde açık ve dürüst iletişim sağlıyoruz.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <FiUser />
                </span>
                Kullanıcı Odaklı Yaklaşım
              </h3>
              <p className="text-gray-700 ml-13">Her kararımızda kullanıcı deneyimini ön planda tutuyoruz.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                Sürekli Yenilik
              </h3>
              <p className="text-gray-700 ml-13">Pazarın değişen ihtiyaçlarına uyum sağlamak için sürekli gelişiyoruz.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </span>
                Kalite ve Mükemmellik
              </h3>
              <p className="text-gray-700 ml-13">Her işimizde en yüksek kalite standartlarını uyguluyoruz.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Bizimle İletişime Geçin</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Sorularınız mı var? Ekibimiz yardımcı olmaktan mutluluk duyacaktır
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:info@newowner.com" className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors">
              <FiMail />
              Email İle Ulaşın
            </a>
            <a href="tel:+902121234567" className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors">
              <FiPhone />
              +90 (212) 123 45 67
            </a>
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
              <div className="relative">
                <Image src={logowite} alt="Newowner" width={100} height={100} />
              </div>
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
                  <Link href="/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Anasayfa</Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Fiyatlar</Link>
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