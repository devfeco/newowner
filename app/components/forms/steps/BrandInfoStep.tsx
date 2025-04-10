'use client'

import React from 'react'
import { FormValues } from '../CreateListingForm'

interface BrandInfoStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function BrandInfoStep({ values, onChange }: BrandInfoStepProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const handleTransferItemsChange = (item: string) => {
    const updatedItems = values.transferItems.includes(item)
      ? values.transferItems.filter(i => i !== item)
      : [...values.transferItems, item]
    
    onChange({ transferItems: updatedItems })
  }
  
  const transferOptions = [
    { id: 'brand', label: 'Marka' },
    { id: 'company', label: 'Şirket' },
    { id: 'website', label: 'Site' },
    { id: 'social', label: 'Sosyal Medya Hesapları' },
    { id: 'operation', label: 'Operasyon' },
    { id: 'assets', label: 'Demirbaşlar ve Tedarikçi Bağlantıları' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-6 mb-4 sm:mb-6 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900">
            Marka Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brandName"
            value={values.brandName}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-2.5"
            placeholder="NEWOWNER"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900">
            Kuruluş Tarihi <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="foundingDate"
            value={values.foundingDate}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-2.5"
            placeholder="28.03.2023"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Marka tescil tarihi, şirket kuruluş tarihi veya domain yaşı</p>
        </div>
      </div>
      
      <div className="grid gap-4 sm:gap-6 mb-4 sm:mb-6 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900">
            Konum <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={values.location}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-2.5"
            placeholder="İSTANBUL/SANCAKTEPE"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Mevcut operasyon konumunu giriniz</p>
        </div>
        
        <div>
          <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900">
            Satış Fiyatı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="price"
            value={values.price}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 sm:p-2.5"
            placeholder="1,100,000 TL"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900">
          Devir Edilecekler <span className="text-red-500">*</span>
        </label>
        <p className="mb-2 text-xs text-gray-500">Devir işleminde dahil olacak varlıkları seçiniz</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {transferOptions.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                id={`transfer-${option.id}`}
                type="checkbox"
                checked={values.transferItems.includes(option.id)}
                onChange={() => handleTransferItemsChange(option.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`transfer-${option.id}`} className="ml-2 text-xs sm:text-sm font-medium text-gray-900">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 