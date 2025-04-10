'use client'

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 animate-pulse">
      {/* Üst Kısım */}
      <div className="flex items-center gap-1 mb-4 sm:mb-8">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4 ml-2"></div>
        <div className="ml-auto h-3 sm:h-4 bg-gray-200 rounded w-1/5"></div>
      </div>
      
      {/* Bilgi Badge'leri */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-200"></div>
            <div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-12 sm:w-16 mb-1"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-10 sm:w-12"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Başlık ve Doğrulama Badge */}
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/5"></div>
      </div>
      
      {/* Açıklama */}
      <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
        <div className="h-2 sm:h-3 bg-gray-200 rounded"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-4/6 sm:block hidden"></div>
      </div>

      {/* Alt Butonlar */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-8 pt-3 sm:pt-4 border-t border-gray-100">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/5 sm:w-1/4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/5 sm:w-1/4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4 sm:w-1/3"></div>
      </div>
    </div>
  )
} 