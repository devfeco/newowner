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
                Son 6 Aylık Toplam Ciro <span className="text-red-500">*</span>
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
          
          {/* Son 6 Aylık Detaylı Ciro */}
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Son 6 Aylık Ciro Bilgileri (Ay Ay)</h4>
            <div className="grid gap-4 md:grid-cols-6">
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">1. Ay</label>
                <input
                  type="text"
                  name="trendyolMonthlySales.month1"
                  value={values.trendyolMonthlySales.month1}
                  onChange={(e) => onChange({ 
                    trendyolMonthlySales: { 
                      ...values.trendyolMonthlySales, 
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
                  name="trendyolMonthlySales.month2"
                  value={values.trendyolMonthlySales.month2}
                  onChange={(e) => onChange({ 
                    trendyolMonthlySales: { 
                      ...values.trendyolMonthlySales, 
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
                  name="trendyolMonthlySales.month3"
                  value={values.trendyolMonthlySales.month3}
                  onChange={(e) => onChange({ 
                    trendyolMonthlySales: { 
                      ...values.trendyolMonthlySales, 
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
                  name="trendyolMonthlySales.month4"
                  value={values.trendyolMonthlySales.month4}
                  onChange={(e) => onChange({ 
                    trendyolMonthlySales: { 
                      ...values.trendyolMonthlySales, 
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
                  name="trendyolMonthlySales.month5"
                  value={values.trendyolMonthlySales.month5}
                  onChange={(e) => onChange({ 
                    trendyolMonthlySales: { 
                      ...values.trendyolMonthlySales, 
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
                  name="trendyolMonthlySales.month6"
                  value={values.trendyolMonthlySales.month6}
                  onChange={(e) => onChange({ 
                    trendyolMonthlySales: { 
                      ...values.trendyolMonthlySales, 
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
        </div>
      )}

      {/* Hepsiburada Bilgileri */}
      {values.marketplaces.includes('hepsiburada') && (
        <div className="p-5 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-orange-500">Hepsiburada</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Son 6 Aylık Toplam Ciro <span className="text-red-500">*</span>
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
          
          {/* Son 6 Aylık Detaylı Ciro */}
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Son 6 Aylık Ciro Bilgileri (Ay Ay)</h4>
            <div className="grid gap-4 md:grid-cols-6">
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">1. Ay</label>
                <input
                  type="text"
                  name="hepsiburadaMonthlySales.month1"
                  value={values.hepsiburadaMonthlySales.month1}
                  onChange={(e) => onChange({ 
                    hepsiburadaMonthlySales: { 
                      ...values.hepsiburadaMonthlySales, 
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
                  name="hepsiburadaMonthlySales.month2"
                  value={values.hepsiburadaMonthlySales.month2}
                  onChange={(e) => onChange({ 
                    hepsiburadaMonthlySales: { 
                      ...values.hepsiburadaMonthlySales, 
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
                  name="hepsiburadaMonthlySales.month3"
                  value={values.hepsiburadaMonthlySales.month3}
                  onChange={(e) => onChange({ 
                    hepsiburadaMonthlySales: { 
                      ...values.hepsiburadaMonthlySales, 
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
                  name="hepsiburadaMonthlySales.month4"
                  value={values.hepsiburadaMonthlySales.month4}
                  onChange={(e) => onChange({ 
                    hepsiburadaMonthlySales: { 
                      ...values.hepsiburadaMonthlySales, 
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
                  name="hepsiburadaMonthlySales.month5"
                  value={values.hepsiburadaMonthlySales.month5}
                  onChange={(e) => onChange({ 
                    hepsiburadaMonthlySales: { 
                      ...values.hepsiburadaMonthlySales, 
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
                  name="hepsiburadaMonthlySales.month6"
                  value={values.hepsiburadaMonthlySales.month6}
                  onChange={(e) => onChange({ 
                    hepsiburadaMonthlySales: { 
                      ...values.hepsiburadaMonthlySales, 
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
        </div>
      )}

      {/* Amazon Bilgileri */}
      {values.marketplaces.includes('amazon') && (
        <div className="p-5 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-[#232F3E]">Amazon</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Son 6 Aylık Toplam Ciro <span className="text-red-500">*</span>
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
          
          {/* Son 6 Aylık Detaylı Ciro */}
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Son 6 Aylık Ciro Bilgileri (Ay Ay)</h4>
            <div className="grid gap-4 md:grid-cols-6">
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">1. Ay</label>
                <input
                  type="text"
                  name="amazonMonthlySales.month1"
                  value={values.amazonMonthlySales.month1}
                  onChange={(e) => onChange({ 
                    amazonMonthlySales: { 
                      ...values.amazonMonthlySales, 
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
                  name="amazonMonthlySales.month2"
                  value={values.amazonMonthlySales.month2}
                  onChange={(e) => onChange({ 
                    amazonMonthlySales: { 
                      ...values.amazonMonthlySales, 
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
                  name="amazonMonthlySales.month3"
                  value={values.amazonMonthlySales.month3}
                  onChange={(e) => onChange({ 
                    amazonMonthlySales: { 
                      ...values.amazonMonthlySales, 
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
                  name="amazonMonthlySales.month4"
                  value={values.amazonMonthlySales.month4}
                  onChange={(e) => onChange({ 
                    amazonMonthlySales: { 
                      ...values.amazonMonthlySales, 
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
                  name="amazonMonthlySales.month5"
                  value={values.amazonMonthlySales.month5}
                  onChange={(e) => onChange({ 
                    amazonMonthlySales: { 
                      ...values.amazonMonthlySales, 
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
                  name="amazonMonthlySales.month6"
                  value={values.amazonMonthlySales.month6}
                  onChange={(e) => onChange({ 
                    amazonMonthlySales: { 
                      ...values.amazonMonthlySales, 
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
        </div>
      )}

      {/* n11 Bilgileri */}
      {values.marketplaces.includes('n11') && (
        <div className="p-5 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-[#7c25f8]">n11</h3>
          
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Son 6 Aylık Toplam Ciro <span className="text-red-500">*</span>
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
          
          {/* Son 6 Aylık Detaylı Ciro */}
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Son 6 Aylık Ciro Bilgileri (Ay Ay)</h4>
            <div className="grid gap-4 md:grid-cols-6">
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-900">1. Ay</label>
                <input
                  type="text"
                  name="n11MonthlySales.month1"
                  value={values.n11MonthlySales.month1}
                  onChange={(e) => onChange({ 
                    n11MonthlySales: { 
                      ...values.n11MonthlySales, 
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
                  name="n11MonthlySales.month2"
                  value={values.n11MonthlySales.month2}
                  onChange={(e) => onChange({ 
                    n11MonthlySales: { 
                      ...values.n11MonthlySales, 
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
                  name="n11MonthlySales.month3"
                  value={values.n11MonthlySales.month3}
                  onChange={(e) => onChange({ 
                    n11MonthlySales: { 
                      ...values.n11MonthlySales, 
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
                  name="n11MonthlySales.month4"
                  value={values.n11MonthlySales.month4}
                  onChange={(e) => onChange({ 
                    n11MonthlySales: { 
                      ...values.n11MonthlySales, 
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
                  name="n11MonthlySales.month5"
                  value={values.n11MonthlySales.month5}
                  onChange={(e) => onChange({ 
                    n11MonthlySales: { 
                      ...values.n11MonthlySales, 
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
                  name="n11MonthlySales.month6"
                  value={values.n11MonthlySales.month6}
                  onChange={(e) => onChange({ 
                    n11MonthlySales: { 
                      ...values.n11MonthlySales, 
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
        </div>
      )}
    </div>
  )
} 