'use client'

import React from 'react'
import { FormValues } from '../CreateListingForm'

interface MarketplaceStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function MarketplaceStep({ values, onChange }: MarketplaceStepProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  // Eğer pazaryeri seçili değilse, bu adımı atla
  if (!values.hasMarketplaces || values.marketplaces.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Pazaryerlerinde satış yapmadığınızı belirttiniz. Bir sonraki adıma geçebilirsiniz.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-600 mb-4">
        Lütfen seçtiğiniz pazaryerleri için aşağıdaki bilgileri doldurun. Bu bilgiler alıcılara işletmenizin performansı hakkında fikir verecektir.
      </p>

      {/* Trendyol Bilgileri */}
      {values.marketplaces.includes('trendyol') && (
        <div className="p-5 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-orange-600">Trendyol</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Son 6 Aylık Ciro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="trendyolSales"
                value={values.trendyolSales}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="1,250,000 TL"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Mağaza Puanı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="trendyolRating"
                value={values.trendyolRating}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="8.5/10"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Ortalama Karlılık Oranı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="trendyolProfitMargin"
                value={values.trendyolProfitMargin}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="%40"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Giderler düşüldükten sonra net kazanç oranı</p>
            </div>
          </div>
        </div>
      )}

      {/* Hepsiburada Bilgileri */}
      {values.marketplaces.includes('hepsiburada') && (
        <div className="p-5 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-orange-500">Hepsiburada</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Son 6 Aylık Ciro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hepsiburadaSales"
                value={values.hepsiburadaSales}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="850,000 TL"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Mağaza Puanı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hepsiburadaRating"
                value={values.hepsiburadaRating}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="9.1/10"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Ortalama Karlılık Oranı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hepsiburadaProfitMargin"
                value={values.hepsiburadaProfitMargin}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="%35"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Giderler düşüldükten sonra net kazanç oranı</p>
            </div>
          </div>
        </div>
      )}

      {/* Amazon Bilgileri */}
      {values.marketplaces.includes('amazon') && (
        <div className="p-5 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-[#232F3E]">Amazon</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Son 6 Aylık Ciro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="amazonSales"
                value={values.amazonSales}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="750,000 TL"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Mağaza Puanı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="amazonRating"
                value={values.amazonRating}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="4.5/5"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Ortalama Karlılık Oranı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="amazonProfitMargin"
                value={values.amazonProfitMargin}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="%38"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Giderler düşüldükten sonra net kazanç oranı</p>
            </div>
          </div>
        </div>
      )}

      {/* n11 Bilgileri */}
      {values.marketplaces.includes('n11') && (
        <div className="p-5 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-[#7c25f8]">n11</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Son 6 Aylık Ciro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="n11Sales"
                value={values.n11Sales}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="450,000 TL"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Mağaza Puanı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="n11Rating"
                value={values.n11Rating}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="8.9/10"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Ortalama Karlılık Oranı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="n11ProfitMargin"
                value={values.n11ProfitMargin}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="%32"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Giderler düşüldükten sonra net kazanç oranı</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 