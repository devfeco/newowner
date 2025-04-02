'use client'

import { FiEye, FiHeart, FiMessageSquare } from 'react-icons/fi'

interface ListingCardProps {
	type: string
	location: string
	foundedYear: string
	category: string
	yearlyRevenue: string
	yearlyProfit: string
	customerCount: string
	price: string
	description: string
	status: string
}

export function ListingCard({
	type,
	location,
	foundedYear,
	category,
	yearlyRevenue,
	yearlyProfit,
	customerCount,
	price,
	description,
	status
}: ListingCardProps) {
	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
			{/* Başlık Kısmı */}
			<div className="flex items-center gap-1 mb-8 text-[15px]">
				<span className="text-gray-500">Türü:</span>
				<span className="font-medium text-gray-900">{type}</span>
				<span className="text-gray-500 ml-2">Merkez:</span>
				<span className="font-medium text-gray-900">{location}</span>
			</div>

			{/* Bilgi Badge'leri */}
			<div className="flex flex-wrap items-center gap-6 mb-8">
				<InfoBadge icon="K" label="Kuruluş" value={foundedYear} />
				<InfoBadge icon="K" label="Kategori" value={category} />
				<InfoBadge icon="Y" label="Yıllık Ciro" value={yearlyRevenue} />
				<InfoBadge icon="Y" label="Yıllık Kar" value={yearlyProfit} />
				<InfoBadge icon="M" label="Müşteri Sayısı" value={customerCount} />
				<InfoBadge icon="F" label="Fiyat" value={price} />
			</div>

			{/* Başlık ve Doğrulama Badge */}
			<div className="flex items-center gap-2 mb-3">
				<h3 className="text-[15px] font-medium text-gray-900">
					Marka Patentli E-Ticaret Sitesi
				</h3>
				<StatusBadge status={status} />
			</div>

			{/* Açıklama */}
			<p className="text-[13.5px] leading-relaxed text-gray-600 mb-6">{description}</p>

			{/* Alt Butonlar */}
			<div className="flex items-center gap-8 pt-4 border-t border-gray-100">
				<button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
					<FiEye className="w-[18px] h-[18px]" />
					<span className="text-[13.5px]">Detaylar</span>
				</button>
				<button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
					<FiHeart className="w-[18px] h-[18px]" />
					<span className="text-[13.5px]">İzlemeye Al</span>
				</button>
				<button className="flex items-center gap-2 text-[#6941C6] hover:text-[#5730a3]">
					<FiMessageSquare className="w-[18px] h-[18px]" />
					<span className="text-[13.5px]">Satıcı İle İletişime Geç</span>
				</button>
			</div>
		</div>
	)
}

function InfoBadge({ icon, label, value }: { icon: string; label: string; value: string }) {
	return (
		<div className="flex items-center gap-2.5">
			<div className="w-8 h-8 rounded-full bg-[#6941C6] flex items-center justify-center text-white text-xs font-medium shadow-sm shadow-[#6941C6]/20">
				{icon}
			</div>
			<div className="flex items-center gap-1">
				<span className="text-[13.5px] text-gray-500">{label}:</span>
				<span className="text-[13.5px] font-medium text-gray-900">{value}</span>
			</div>
		</div>
	)
}

function StatusBadge({ status }: { status: string }) {
	return (
		<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF3] border border-[#ABEFC6]">
			<div className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
			<span className="text-[11px] font-medium text-[#027A48] tracking-wide">
				{status}
			</span>
		</div>
	)
}