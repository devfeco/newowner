'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// Form adımları
import BrandInfoStep from './steps/BrandInfoStep'
import CategoryStep from './steps/CategoryStep'
import SalesChannelsStep from './steps/SalesChannelsStep'
import MarketplaceStep from './steps/MarketplaceStep'
import WebsiteStep from './steps/WebsiteStep'
import SocialMediaStep from './steps/SocialMediaStep'
import FinancialInfoStep from './steps/FinancialInfoStep'
import DetailsStep from './steps/DetailsStep'

// Form değerleri ve validasyon için tip tanımları
export type FormValues = {
  // Marka ve Temel Bilgiler
  brandName: string
  category: string
  foundingDate: string
  location: string
  price: string
  transferItems: string[]
  
  // Pazaryeri Bilgileri
  hasMarketplaces: boolean
  marketplaces: string[]
  trendyolSales: string
  trendyolRating: string
  trendyolProfitMargin: string
  trendyolMonthlySales: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  amazonSales: string
  amazonRating: string
  amazonProfitMargin: string
  amazonMonthlySales: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  hepsiburadaSales: string
  hepsiburadaRating: string
  hepsiburadaProfitMargin: string
  hepsiburadaMonthlySales: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  n11Sales: string
  n11Rating: string
  n11ProfitMargin: string
  n11MonthlySales: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  
  // Web Sitesi Bilgileri
  hasWebsite: boolean
  websiteUrl: string
  salesCount: string
  websiteSales: string
  websiteMonthlySales: {
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
  }
  visitCount: string
  websiteProfitMargin: string
  ecommerceInfrastructure: string
  licenseRenewalDate: string
  hasSearchEngineBan: boolean
  searchEngineBanDetails: string
  
  // Sosyal Medya Bilgileri
  hasSocialMedia: boolean
  socialMediaAccounts: {
    instagram: boolean
    instagramFollowers: string
    tiktok: boolean
    tiktokFollowers: string
    facebook: boolean
    facebookFollowers: string
    twitter: boolean
    twitterFollowers: string
    youtube: boolean
    youtubeFollowers: string
    linkedin: boolean
    linkedinFollowers: string
  }
  
  // Finansal Bilgiler
  inventoryValue: string
  inventoryDetails: string
  yearlyProfit: string
  yearlySales: string
  monthlyExpenses: string
  hasLegalObstacles: boolean
  legalObstacleDetails: string
  founderExperience: string
  
  // Detaylar
  willProvideSupport: boolean
  supportDuration: string
  supportDetails: string
  listingDescription: string
}

const initialValues: FormValues = {
  brandName: '',
  category: '',
  foundingDate: '',
  location: '',
  price: '',
  transferItems: [],
  
  hasMarketplaces: false,
  marketplaces: [],
  trendyolSales: '',
  trendyolRating: '',
  trendyolProfitMargin: '',
  trendyolMonthlySales: {
    month1: '',
    month2: '',
    month3: '',
    month4: '',
    month5: '',
    month6: ''
  },
  amazonSales: '',
  amazonRating: '',
  amazonProfitMargin: '',
  amazonMonthlySales: {
    month1: '',
    month2: '',
    month3: '',
    month4: '',
    month5: '',
    month6: ''
  },
  hepsiburadaSales: '',
  hepsiburadaRating: '',
  hepsiburadaProfitMargin: '',
  hepsiburadaMonthlySales: {
    month1: '',
    month2: '',
    month3: '',
    month4: '',
    month5: '',
    month6: ''
  },
  n11Sales: '',
  n11Rating: '',
  n11ProfitMargin: '',
  n11MonthlySales: {
    month1: '',
    month2: '',
    month3: '',
    month4: '',
    month5: '',
    month6: ''
  },
  
  hasWebsite: false,
  websiteUrl: '',
  salesCount: '',
  websiteSales: '',
  websiteMonthlySales: {
    month1: '',
    month2: '',
    month3: '',
    month4: '',
    month5: '',
    month6: ''
  },
  visitCount: '',
  websiteProfitMargin: '',
  ecommerceInfrastructure: '',
  licenseRenewalDate: '',
  hasSearchEngineBan: false,
  searchEngineBanDetails: '',
  
  hasSocialMedia: false,
  socialMediaAccounts: {
    instagram: false,
    instagramFollowers: '',
    tiktok: false,
    tiktokFollowers: '',
    facebook: false,
    facebookFollowers: '',
    twitter: false,
    twitterFollowers: '',
    youtube: false,
    youtubeFollowers: '',
    linkedin: false,
    linkedinFollowers: '',
  },
  
  inventoryValue: '',
  inventoryDetails: '',
  yearlyProfit: '',
  yearlySales: '',
  monthlyExpenses: '',
  hasLegalObstacles: false,
  legalObstacleDetails: '',
  founderExperience: '',
  
  willProvideSupport: false,
  supportDuration: '',
  supportDetails: '',
  listingDescription: '',
}

const steps = [
  { id: 'brand-info', title: 'Marka Bilgileri' },
  { id: 'category', title: 'Kategori' },
  { id: 'sales-channels', title: 'Satış Kanalları' },
  { id: 'marketplace', title: 'Pazaryeri Bilgileri' },
  { id: 'website', title: 'Web Sitesi Bilgileri' },
  { id: 'social-media', title: 'Sosyal Medya' },
  { id: 'financial', title: 'Finansal Bilgiler' },
  { id: 'details', title: 'Detaylar' }
]

export default function CreateListingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Dinamik form adımlarını hesapla
  const getActiveSteps = () => {
    const activeSteps = [...steps];
    
    // Kullanıcı pazaryeri satışı yapmıyorsa o adımı atla
    if (!formValues.hasMarketplaces) {
      const marketplaceIndex = activeSteps.findIndex(step => step.id === 'marketplace');
      if (marketplaceIndex !== -1) {
        activeSteps.splice(marketplaceIndex, 1);
      }
    }
    
    // Kullanıcının web sitesi yoksa o adımı atla
    if (!formValues.hasWebsite) {
      const websiteIndex = activeSteps.findIndex(step => step.id === 'website');
      if (websiteIndex !== -1) {
        activeSteps.splice(websiteIndex, 1);
      }
    }
    
    // Kullanıcının sosyal medya hesabı yoksa o adımı atla
    if (!formValues.hasSocialMedia) {
      const socialMediaIndex = activeSteps.findIndex(step => step.id === 'social-media');
      if (socialMediaIndex !== -1) {
        activeSteps.splice(socialMediaIndex, 1);
      }
    }
    
    return activeSteps;
  };
  
  // Aktif adımlar
  const activeSteps = getActiveSteps();
  
  // Adım başlıklarını göster
  const renderStepIndicators = () => {
    return (
      <div className="hidden md:flex mb-8 justify-between">
        {activeSteps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex flex-col items-center ${index === currentStep ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                index === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs font-medium">{step.title}</span>
          </div>
        ))}
      </div>
    )
  }
  
  // Mobil için adım göstergesi
  const renderMobileStepIndicator = () => {
    return (
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm text-gray-600 font-medium">
            Adım {currentStep + 1}/{activeSteps.length}
          </h3>
          <span className="text-sm text-blue-600 font-medium">
            {activeSteps[currentStep]?.title}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }
  
  // Adımın gerçek içeriğini döndür
  const getCurrentStepContent = (step: string) => {
    switch (step) {
      case 'brand-info':
        return (
          <BrandInfoStep 
            values={formValues} 
            onChange={(values) => setFormValues({ ...formValues, ...values })} 
          />
        );
      case 'category':
        return (
          <CategoryStep 
            values={formValues} 
            onChange={(values: Record<string, any>) => setFormValues({ ...formValues, ...values })} 
          />
        );
      case 'sales-channels':
        return (
          <SalesChannelsStep 
            values={formValues} 
            onChange={(values: Record<string, any>) => {
              // Satış kanalları değiştiğinde form yeniden hesaplansın
              setFormValues({ ...formValues, ...values });
            }} 
          />
        );
      case 'marketplace':
        return (
          <MarketplaceStep 
            values={formValues} 
            onChange={(values) => setFormValues({ ...formValues, ...values })} 
          />
        );
      case 'website':
        return (
          <WebsiteStep 
            values={formValues} 
            onChange={(values) => setFormValues({ ...formValues, ...values })} 
          />
        );
      case 'social-media':
        return (
          <SocialMediaStep 
            values={formValues} 
            onChange={(values) => setFormValues({ ...formValues, ...values })} 
          />
        );
      case 'financial':
        return (
          <FinancialInfoStep 
            values={formValues} 
            onChange={(values) => setFormValues({ ...formValues, ...values })} 
          />
        );
      case 'details':
        return (
          <DetailsStep 
            values={formValues} 
            onChange={(values) => setFormValues({ ...formValues, ...values })} 
          />
        );
      default:
        return null;
    }
  };
  
  // Multistep formdaki adımları göster
  const renderStep = () => {
    if (currentStep < activeSteps.length) {
      const stepId = activeSteps[currentStep].id;
      return getCurrentStepContent(stepId);
    }
    return null;
  }
  
  const goToNextStep = () => {
    // Sonraki adıma geç
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      // Son adımdayız, formu gönder
      handleSubmit()
    }
  }
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/listings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formValues),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('İlanınız başarıyla oluşturuldu!')
        router.push('/')
      } else {
        throw new Error(data.message || 'Bir hata oluştu')
      }
    } catch (error: any) {
      console.error('Form gönderme hatası:', error)
      alert(`İlan oluşturulurken bir hata oluştu: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="w-full">
      {renderStepIndicators()}
      {renderMobileStepIndicator()}
      
      <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6">{activeSteps[currentStep].title}</h2>
        {renderStep()}
      </div>
      
      <div className="flex justify-between sm:justify-end space-x-3 sm:space-x-5">
        <button 
          type="button"
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          className="flex-1 sm:flex-initial min-w-[80px] h-[40px] sm:h-[45px] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md border border-[#9CD1F2] text-[#9CD1F2] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Geri
        </button>
        
        {currentStep < activeSteps.length - 1 ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="flex-1 sm:flex-initial min-w-[80px] h-[40px] sm:h-[45px] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md bg-[#0066FF] hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
          >
            Devam
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial min-w-[80px] h-[40px] sm:h-[45px] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md bg-[#0066FF] hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </>
            ) : (
              'Yayınla'
            )}
          </button>
        )}
      </div>
    </div>
  )
} 