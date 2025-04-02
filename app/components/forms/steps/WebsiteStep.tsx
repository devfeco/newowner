'use client'

import React from 'react'
import { FormValues } from '../CreateListingForm'

interface WebsiteStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function WebsiteStep({ values, onChange }: WebsiteStepProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value === 'true' })
  }

  // Eğer e-ticaret sitesi yoksa, bu adımı atla
  if (!values.hasWebsite) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          E-ticaret siteniz olmadığını belirttiniz. Bir sonraki adıma geçebilirsiniz.
        </p>
      </div>
    )
  }

  const ecommerceInfrastructures = [
    'Shopify', 'Ticimax', 'Ideasoft', 'T-soft', 'Ikas', 
    'Opencart', 'Woocommerce', 'Magento', 'Prestashop', 'Diğer'
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        E-ticaret siteniz ile ilgili detaylı bilgileri doldurun. Bu bilgiler, markanızın dijital varlığı hakkında alıcılara değerli bilgiler sağlayacaktır.
      </p>
      
      {/* Temel web sitesi bilgileri */}
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Web Sitesi URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="websiteUrl"
            value={values.websiteUrl}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="https://example.com"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            E-Ticaret Altyapısı <span className="text-red-500">*</span>
          </label>
          <select
            name="ecommerceInfrastructure"
            value={values.ecommerceInfrastructure}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="">Altyapı Seçin</option>
            {ecommerceInfrastructures.map((infrastructure) => (
              <option key={infrastructure} value={infrastructure.toLowerCase()}>
                {infrastructure}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Lisans bilgileri */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          E-Ticaret Altyapısı Lisans Yenileme Tarihi
        </label>
        <input
          type="date"
          name="licenseRenewalDate"
          value={values.licenseRenewalDate}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="license-unlimited"
            onChange={() => onChange({ licenseRenewalDate: 'Süresiz' })}
            checked={values.licenseRenewalDate === 'Süresiz'}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="license-unlimited" className="ml-2 text-sm font-medium text-gray-700">
            Süresiz Lisans
          </label>
        </div>
      </div>
      
      {/* Satış İstatistikleri */}
      <div className="p-5 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Satış İstatistikleri</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Son 6 Aylık Satış Adeti <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="salesCount"
              value={values.salesCount}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="1,235 adet"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Son 6 Aylık Ciro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="websiteSales"
              value={values.websiteSales}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="750,000 TL"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Lütfen sadece site cirolarını giriniz</p>
          </div>
          
          {/* Son 6 Aylık Detaylı Ciro */}
          <div className="col-span-2 mt-6">
            <h4 className="text-md font-medium mb-3">Son 6 Aylık Ciro Bilgileri (Ay Ay)</h4>
            <div className="grid gap-4 md:grid-cols-6">
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">1. Ay</label>
                <input
                  type="text"
                  name="websiteMonthlySales.month1"
                  value={values.websiteMonthlySales.month1}
                  onChange={(e) => onChange({ 
                    websiteMonthlySales: { 
                      ...values.websiteMonthlySales, 
                      month1: e.target.value 
                    } 
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="TL"
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">2. Ay</label>
                <input
                  type="text"
                  name="websiteMonthlySales.month2"
                  value={values.websiteMonthlySales.month2}
                  onChange={(e) => onChange({ 
                    websiteMonthlySales: { 
                      ...values.websiteMonthlySales, 
                      month2: e.target.value 
                    } 
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="TL"
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">3. Ay</label>
                <input
                  type="text"
                  name="websiteMonthlySales.month3"
                  value={values.websiteMonthlySales.month3}
                  onChange={(e) => onChange({ 
                    websiteMonthlySales: { 
                      ...values.websiteMonthlySales, 
                      month3: e.target.value 
                    } 
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="TL"
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">4. Ay</label>
                <input
                  type="text"
                  name="websiteMonthlySales.month4"
                  value={values.websiteMonthlySales.month4}
                  onChange={(e) => onChange({ 
                    websiteMonthlySales: { 
                      ...values.websiteMonthlySales, 
                      month4: e.target.value 
                    } 
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="TL"
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">5. Ay</label>
                <input
                  type="text"
                  name="websiteMonthlySales.month5"
                  value={values.websiteMonthlySales.month5}
                  onChange={(e) => onChange({ 
                    websiteMonthlySales: { 
                      ...values.websiteMonthlySales, 
                      month5: e.target.value 
                    } 
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="TL"
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">6. Ay</label>
                <input
                  type="text"
                  name="websiteMonthlySales.month6"
                  value={values.websiteMonthlySales.month6}
                  onChange={(e) => onChange({ 
                    websiteMonthlySales: { 
                      ...values.websiteMonthlySales, 
                      month6: e.target.value 
                    } 
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="TL"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Son 6 ayın her ayı için ciro bilgisini ayrı ayrı giriniz (en son ay sağda olacak şekilde)</p>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Son 6 Aylık Hit Sayısı
            </label>
            <input
              type="text"
              name="visitCount"
              value={values.visitCount}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="120,000"
            />
            <p className="mt-1 text-xs text-gray-500">Google Analytics verilerinden alabilirsiniz</p>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Ortalama Karlılık Oranı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="websiteProfitMargin"
              value={values.websiteProfitMargin}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="%40"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Tüm işletme giderleri düşüldükten sonra net kazanç</p>
          </div>
        </div>
      </div>
      
      {/* SEO Durumu */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-900">
          Banlı olduğu arama motoru var mı?
        </label>
        
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="hasSearchEngineBan-yes"
              name="hasSearchEngineBan"
              value="true"
              checked={values.hasSearchEngineBan === true}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasSearchEngineBan-yes" className="ml-2 text-sm font-medium text-gray-900">Var</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="hasSearchEngineBan-no"
              name="hasSearchEngineBan"
              value="false"
              checked={values.hasSearchEngineBan === false}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasSearchEngineBan-no" className="ml-2 text-sm font-medium text-gray-900">Yok</label>
          </div>
        </div>
        
        {values.hasSearchEngineBan && (
          <div className="mt-3 ml-6 p-4 border-l-2 border-red-100">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Ban durumu açıklaması
            </label>
            <textarea
              name="searchEngineBanDetails"
              onChange={(e) => onChange({ searchEngineBanDetails: e.target.value })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24"
              placeholder="Lütfen ban durumu hakkında detaylı bilgi verin"
            />
          </div>
        )}
      </div>
    </div>
  )
} 