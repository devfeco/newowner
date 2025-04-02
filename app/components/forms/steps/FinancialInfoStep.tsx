'use client'

import React from 'react'
import { FormValues } from '../CreateListingForm'

interface FinancialInfoStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function FinancialInfoStep({ values, onChange }: FinancialInfoStepProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value === 'true' })
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-600 mb-4">
        Finansal detaylar, yatırımcıların işletmeniz hakkında daha iyi fikir edinmelerine yardımcı olacaktır. Lütfen mümkün olduğunca doğru bilgiler girmeye çalışın.
      </p>
      
      {/* Finansal Performans */}
      <div className="p-5 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Finansal Performans</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Yıllık Ciro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="yearlySales"
              value={values.yearlySales}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="2,500,000 TL"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Son mali yılın toplam cirosu</p>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Yıllık Kâr <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="yearlyProfit"
              value={values.yearlyProfit}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="750,000 TL"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Vergiler ve giderler düşüldükten sonraki net kazanç</p>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Aylık İşletme Giderleri <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="monthlyExpenses"
              value={values.monthlyExpenses}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="35,000 TL"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Personel, kira, abonelikler, depolama vb.</p>
          </div>
        </div>
      </div>
      
      {/* Envanter */}
      <div className="p-5 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Envanter</h3>
        
        <div className="grid gap-6 md:grid-cols-1">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Envanter Değeri <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="inventoryValue"
              value={values.inventoryValue}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="350,000 TL"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Mevcut stok ve ürünlerin toplam değeri</p>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Envanter Detayları
            </label>
            <textarea
              name="inventoryDetails"
              value={values.inventoryDetails}
              onChange={handleInputChange}
              rows={4}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Envanter içeriği, miktar ve değer bilgileri..."
            />
            <p className="mt-1 text-xs text-gray-500">Ne tür ürünler var, miktarları ve değerleri hakkında bilgi verin</p>
          </div>
        </div>
      </div>
      
      {/* Yasal Engeller */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-900">
          Satışa engel yasal durum var mı? <span className="text-red-500">*</span>
        </label>
        
        <div className="flex space-x-6 mb-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="hasLegalObstacles-yes"
              name="hasLegalObstacles"
              value="true"
              checked={values.hasLegalObstacles === true}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasLegalObstacles-yes" className="ml-2 text-sm font-medium text-gray-900">Var</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="hasLegalObstacles-no"
              name="hasLegalObstacles"
              value="false"
              checked={values.hasLegalObstacles === false}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label htmlFor="hasLegalObstacles-no" className="ml-2 text-sm font-medium text-gray-900">Yok</label>
          </div>
        </div>
        
        {values.hasLegalObstacles && (
          <div className="ml-6 p-4 border-l-2 border-red-100">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Yasal Engel Detayları <span className="text-red-500">*</span>
            </label>
            <textarea
              name="legalObstacleDetails"
              value={values.legalObstacleDetails}
              onChange={handleInputChange}
              rows={4}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Yasal engel detaylarını açıklayın..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">Dava, haciz, yasal soruşturma vb. durumları belirtin</p>
          </div>
        )}
      </div>
    </div>
  )
} 