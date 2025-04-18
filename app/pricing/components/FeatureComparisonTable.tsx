import React from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function FeatureComparisonTable() {
  const features = [
    {
      category: 'Temel Özellikler',
      items: [
        { name: 'Hesap oluşturma', free: true, premium: true },
        { name: 'İlan görüntüleme', free: true, premium: true },
        { name: 'E-posta bildirimler', free: true, premium: true },
        { name: 'İşlem takibi', free: true, premium: true },
        { name: 'Destek merkezi erişimi', free: true, premium: true },
      ]
    },
    {
      category: 'İş Fırsatları',
      items: [
        { name: 'Satıcı iletişim bilgileri', free: false, premium: true },
        { name: 'İşletme detaylı mali verileri', free: false, premium: true },
        { name: 'Alıcı ilgi bildirimi', free: true, premium: true },
        { name: 'Gelişmiş arama ve filtreleme', free: false, premium: true },
        { name: 'İşletme incelemesi raporları', free: false, premium: true },
      ]
    },
    {
      category: 'Alım-Satım Süreci',
      items: [
        { name: 'Görüşme aracılık hizmeti', free: false, premium: true },
        { name: 'Öncelikli işlem sırası', free: false, premium: true },
        { name: 'Sözleşme şablonları', free: false, premium: true },
        { name: 'Güvenli ödeme süreçleri', free: true, premium: true },
        { name: 'İşlem sonrası destek', free: false, premium: true },
      ]
    },
    {
      category: 'Bildirimler',
      items: [
        { name: 'Yeni ilan bildirimleri', free: true, premium: true },
        { name: 'Öncelikli bildirimler', free: false, premium: true },
        { name: 'Fiyat değişimi bildirimleri', free: false, premium: true },
        { name: 'Özel ilgi alanı uyarıları', free: false, premium: true },
      ]
    },
    {
      category: 'Destek',
      items: [
        { name: 'Temel destek', free: true, premium: true },
        { name: 'Öncelikli destek', free: false, premium: true },
        { name: '7/24 destek erişimi', free: false, premium: true },
        { name: 'Kişisel müşteri temsilcisi', free: false, premium: true },
      ]
    }
  ]

  return (
    <div className="overflow-x-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-2/4 bg-gray-50 border-b border-gray-200">
                Özellik
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4 bg-gray-50 border-b border-gray-200">
                Ücretsiz
              </th>
              <th scope="col" className="px-6 py-5 text-center text-sm font-semibold text-indigo-700 uppercase tracking-wider w-1/4 bg-indigo-50 border-b border-indigo-100">
                Premium
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((featureGroup, groupIndex) => (
              <React.Fragment key={`group-${groupIndex}`}>
                {/* Category Header */}
                <tr className="bg-gradient-to-r from-gray-50 to-white">
                  <td colSpan={3} className="px-6 py-4 text-sm font-bold text-indigo-900 border-t border-gray-100">
                    {featureGroup.category}
                  </td>
                </tr>
                
                {/* Features */}
                {featureGroup.items.map((feature, featureIndex) => (
                  <tr 
                    key={`feature-${groupIndex}-${featureIndex}`} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.free ? (
                        <div className="flex justify-center">
                          <div className="rounded-full bg-green-100 p-1">
                            <CheckIcon className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="rounded-full bg-gray-100 p-1">
                            <XMarkIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center bg-indigo-50/30">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-indigo-100 p-1">
                          <CheckIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 