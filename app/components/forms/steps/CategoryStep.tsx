'use client'

import React from 'react'
import { FormValues } from '../CreateListingForm'

interface CategoryStepProps {
  values: FormValues
  onChange: (values: Partial<FormValues>) => void
}

export default function CategoryStep({ values, onChange }: CategoryStepProps) {
  const categories = [
    { id: 'auto', label: 'Oto Aksesuar', description: 'Araç aksesuarları, bakım ürünleri ve yedek parçalar' },
    { id: 'home-textile', label: 'Ev Tekstili', description: 'Nevresim takımları, perdeler, havlular ve diğer ev tekstil ürünleri' },
    { id: 'women-clothing', label: 'Kadın Giyim', description: 'Kadın giyim, ayakkabı ve aksesuar ürünleri' },
    { id: 'men-clothing', label: 'Erkek Giyim', description: 'Erkek giyim, ayakkabı ve aksesuar ürünleri' },
    { id: 'electronics', label: 'Elektronik', description: 'Telefon, bilgisayar, tablet ve diğer elektronik ürünler' },
    { id: 'cosmetics', label: 'Kozmetik', description: 'Makyaj ürünleri, cilt bakımı ve kozmetik ürünleri' },
    { id: 'shoes-bags', label: 'Ayakkabı & Çanta', description: 'Çeşitli ayakkabı ve çanta ürünleri' },
    { id: 'home-living', label: 'Ev & Yaşam', description: 'Mobilya, dekorasyon ve ev yaşam ürünleri' },
    { id: 'mother-baby', label: 'Anne & Bebek', description: 'Bebek ürünleri, oyuncaklar ve anne ihtiyaçları' },
    { id: 'sports', label: 'Spor & Outdoor', description: 'Spor ekipmanları, giyim ve outdoor ürünleri' },
    { id: 'books', label: 'Kitap & Hobi', description: 'Kitaplar, kırtasiye ve hobi malzemeleri' },
    { id: 'pet-supplies', label: 'Evcil Hayvan', description: 'Evcil hayvan mamaları, oyuncakları ve bakım ürünleri' },
    { id: 'food-beverage', label: 'Gıda & İçecek', description: 'Gıda ürünleri, içecekler ve mutfak malzemeleri' },
    { id: 'jewelry', label: 'Takı & Mücevher', description: 'Takılar, mücevherler ve aksesuarlar' },
    { id: 'other', label: 'Diğer', description: 'Diğer kategorilere girmeyen ürünler' },
  ]

  const handleCategorySelect = (categoryId: string) => {
    onChange({ category: categoryId })
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Lütfen markanızın ürünlerinin yer aldığı ana kategoriyi seçin. Bu seçim, ilanınızınızın doğru alıcılara ulaşmasında önemli rol oynayacaktır.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              values.category === category.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id={`category-${category.id}`}
                name="category"
                checked={values.category === category.id}
                onChange={() => handleCategorySelect(category.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 text-sm font-medium text-gray-900">
                {category.label}
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500 pl-6">{category.description}</p>
          </div>
        ))}
      </div>

      {values.category === 'other' && (
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Diğer kategori açıklaması
          </label>
          <input
            type="text"
            name="categoryOther"
            onChange={(e) => onChange({ categoryOther: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Kategori bilgisi giriniz"
          />
        </div>
      )}
    </div>
  )
} 