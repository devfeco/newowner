'use client'

import React, { useEffect } from 'react'
import { FormValues } from '../CreateListingForm'

interface SalesChannelsStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function SalesChannelsStep({ values, onChange }: SalesChannelsStepProps) {
  useEffect(() => {
    // Bileşen yüklendiğinde veya seçimler değiştiğinde bu etkileşim çalışır
    // Bu sayede form adımları dinamik olarak güncellenebilir
  }, [values.hasMarketplaces, values.hasWebsite, values.hasSocialMedia]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value === 'true' })
  }

  const handleMarketplaceSelect = (marketplace: string) => {
    const updatedMarketplaces = values.marketplaces.includes(marketplace)
      ? values.marketplaces.filter(m => m !== marketplace)
      : [...values.marketplaces, marketplace]
    
    onChange({ marketplaces: updatedMarketplaces })
  }

  const marketplaces = [
    { id: 'trendyol', label: 'Trendyol' },
    { id: 'hepsiburada', label: 'Hepsiburada' },
    { id: 'amazon', label: 'Amazon' },
    { id: 'n11', label: 'n11' },
    { id: 'gittigidiyor', label: 'GittiGidiyor' },
    { id: 'ciceksepeti', label: 'ÇiçekSepeti' },
    { id: 'pttavm', label: 'PTT AVM' },
    { id: 'other', label: 'Diğer' },
  ]

  return (
    <div className="space-y-8">
      {/* Pazaryeri Satışları */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-900">
          Pazaryerlerinde satışı var mı? <span className="text-red-500">*</span>
        </label>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="hasMarketplaces-yes"
              name="hasMarketplaces"
              value="true"
              checked={values.hasMarketplaces === true}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasMarketplaces-yes" className="ml-2 text-sm font-medium text-gray-900">Var</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="hasMarketplaces-no"
              name="hasMarketplaces"
              value="false"
              checked={values.hasMarketplaces === false}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasMarketplaces-no" className="ml-2 text-sm font-medium text-gray-900">Yok</label>
          </div>
        </div>
      </div>
      
      {/* Pazaryeri seçimi - sadece "Var" seçildiyse görünür */}
      {values.hasMarketplaces && (
        <div className="ml-6 p-4 border-l-2 border-blue-100">
          <label className="block mb-3 text-sm font-medium text-gray-900">
            Satış Yapılan Pazaryerleri <span className="text-red-500">*</span>
          </label>
          <p className="mb-2 text-xs text-gray-500">Satış yaptığınız tüm pazaryerlerini seçiniz</p>
          
          <div className="grid md:grid-cols-2 gap-3">
            {marketplaces.map((marketplace) => (
              <div key={marketplace.id} className="flex items-center">
                <input
                  id={`marketplace-${marketplace.id}`}
                  type="checkbox"
                  checked={values.marketplaces.includes(marketplace.id)}
                  onChange={() => handleMarketplaceSelect(marketplace.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`marketplace-${marketplace.id}`} className="ml-2 text-sm font-medium text-gray-900">
                  {marketplace.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* E-Ticaret Sitesi */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-900">
          E-Ticaret sitesi var mı? <span className="text-red-500">*</span>
        </label>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="hasWebsite-yes"
              name="hasWebsite"
              value="true"
              checked={values.hasWebsite === true}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasWebsite-yes" className="ml-2 text-sm font-medium text-gray-900">Var</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="hasWebsite-no"
              name="hasWebsite"
              value="false"
              checked={values.hasWebsite === false}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasWebsite-no" className="ml-2 text-sm font-medium text-gray-900">Yok</label>
          </div>
        </div>
      </div>
      
      {/* Website URL - sadece "Var" seçildiyse görünür */}
      {values.hasWebsite && (
        <div className="ml-6 p-4 border-l-2 border-blue-100">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            E-Ticaret Sitesi Adresi <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="websiteUrl"
            value={values.websiteUrl}
            onChange={(e) => onChange({ websiteUrl: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="https://example.com"
            required
          />
        </div>
      )}
      
      {/* Sosyal Medya */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-900">
          Sosyal Medya Hesapları var mı? <span className="text-red-500">*</span>
        </label>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="hasSocialMedia-yes"
              name="hasSocialMedia"
              value="true"
              checked={values.hasSocialMedia === true}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasSocialMedia-yes" className="ml-2 text-sm font-medium text-gray-900">Var</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="hasSocialMedia-no"
              name="hasSocialMedia"
              value="false"
              checked={values.hasSocialMedia === false}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasSocialMedia-no" className="ml-2 text-sm font-medium text-gray-900">Yok</label>
          </div>
        </div>
      </div>
    </div>
  )
} 