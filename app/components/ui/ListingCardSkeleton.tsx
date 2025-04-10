'use client'

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      {/* Üst Kısım */}
      <div className="flex items-center gap-1 mb-8">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 ml-2"></div>
        <div className="ml-auto h-4 bg-gray-200 rounded w-1/5"></div>
      </div>
      
      {/* Bilgi Badge'leri */}
      <div className="flex flex-wrap items-center gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Başlık ve Doğrulama Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4 ml-auto"></div>
      </div>
      
      {/* Açıklama */}
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Alt Butonlar */}
      <div className="flex items-center gap-8 pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )
} 