'use client'

import React from 'react'
import { FormValues } from '../CreateListingForm'

interface DetailsStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function DetailsStep({ values, onChange }: DetailsStepProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value === 'true' })
  }

  const supportDurations = [
    { value: '1-week', label: '1 Hafta' },
    { value: '2-week', label: '2 Hafta' },
    { value: '1-month', label: '1 Ay' },
    { value: '3-month', label: '3 Ay' },
    { value: '6-month', label: '6 Ay' },
    { value: 'custom', label: 'Diğer' }
  ]

  return (
    <div className="space-y-8">
      {/* İlan Açıklaması */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          İlan Açıklaması <span className="text-red-500">*</span>
        </label>
        <textarea
          name="listingDescription"
          value={values.listingDescription}
          onChange={handleInputChange}
          rows={6}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Markanız, ürünleriniz ve devir nedeni hakkında detaylı bilgi veriniz..."
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Markanızın güçlü yönlerini, büyüme potansiyelini ve neden satmak istediğinizi belirtin
        </p>
      </div>

      {/* Satış Sonrası Destek */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-900">
          Satış sonrası destek verecek misiniz? <span className="text-red-500">*</span>
        </label>
        
        <div className="flex space-x-6 mb-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="willProvideSupport-yes"
              name="willProvideSupport"
              value="true"
              checked={values.willProvideSupport === true}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="willProvideSupport-yes" className="ml-2 text-sm font-medium text-gray-900">Evet</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="willProvideSupport-no"
              name="willProvideSupport"
              value="false"
              checked={values.willProvideSupport === false}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="willProvideSupport-no" className="ml-2 text-sm font-medium text-gray-900">Hayır</label>
          </div>
        </div>
        
        {values.willProvideSupport && (
          <div className="ml-6 p-4 border-l-2 border-blue-100 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Destek Süresi <span className="text-red-500">*</span>
              </label>
              <select
                name="supportDuration"
                value={values.supportDuration}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Destek Süresi Seçin</option>
                {supportDurations.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Destek Detayları <span className="text-red-500">*</span>
              </label>
              <textarea
                name="supportDetails"
                value={values.supportDetails}
                onChange={handleInputChange}
                rows={4}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Destek kapsamında neler yapacağınızı detaylı anlatın..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Tedarikçiler, müşteriler, operasyon süreçleri, ürün geliştirme gibi alanlarda nasıl destek vereceğinizi belirtin
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Kurucu Deneyimi */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Kurucunun Deneyimi
        </label>
        <textarea
          name="founderExperience"
          value={values.founderExperience}
          onChange={handleInputChange}
          rows={4}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Bu sektörde kaç yıldır faaliyet gösteriyorsunuz? Önceki deneyimleriniz nelerdir?"
        />
        <p className="mt-1 text-xs text-gray-500">
          Alıcılar, kurucunun deneyimiyle daha fazla ilgilenebilir
        </p>
      </div>
    </div>
  )
} 