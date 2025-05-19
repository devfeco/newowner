'use client'

import { FiEye, FiHeart, FiCalendar, FiFolder, FiDollarSign, FiTrendingUp, FiUsers, FiTag } from 'react-icons/fi'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const CATEGORY_MAP: { [key: string]: string } = {
	'auto': 'Oto Aksesuar',
	'home-textile': 'Ev Tekstili',
	'women-clothing': 'Kadın Giyim',
	'men-clothing': 'Erkek Giyim',
	'electronics': 'Elektronik',
	'cosmetics': 'Kozmetik',
	'shoes-bags': 'Ayakkabı & Çanta',
	'home-living': 'Ev & Yaşam',
	'mother-baby': 'Anne & Bebek',
	'sports': 'Spor & Outdoor',
	'books': 'Kitap & Hobi',
	'pet-supplies': 'Evcil Hayvan',
	'food-beverage': 'Gıda & İçecek',
	'jewelry': 'Takı & Mücevher',
	'other': 'Diğer'
}

interface InfoBadgeProps {
	icon: ReactNode
	label: string
	value: string
	tooltip?: string
}

function InfoBadge({ icon, label, value, tooltip }: InfoBadgeProps) {
	const [showTooltip, setShowTooltip] = useState(false)
	
	return (
		<div 
			className="flex items-center gap-1.5 sm:gap-2 relative"
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			<div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#6941C6] flex items-center justify-center text-white text-xs sm:text-sm">
				{icon}
			</div>
			<div>
				<p className="text-[11px] sm:text-[13px] text-gray-500">{label}</p>
				<p className="text-[12px] sm:text-[13.5px] font-medium text-gray-900">{value}</p>
			</div>
			
			{tooltip && showTooltip && (
				<div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
					{tooltip}
					<div className="absolute bottom-0 left-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
				</div>
			)}
		</div>
	)
}

interface StatusBadgeProps {
	status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[12px] font-medium ${
			status === 'Doğrulandı' 
				? 'bg-green-50 text-green-700' 
				: 'bg-yellow-50 text-yellow-700'
		}`}>
			{status}
		</span>
	)
}

interface ListingCardProps {
	_id: string
	listingTitle: string
	location: string
	foundingDate: string
	category: string
	yearlySales: string
	yearlyProfit: string
	salesCount?: string
	price: string
	listingDescription: string
	status: string
	userId: string
}

export function ListingCard({
	_id,
	listingTitle,
	location,
	foundingDate,
	category,
	yearlySales,
	yearlyProfit,
	salesCount = '0',
	price,
	listingDescription,
	status,
	userId
}: ListingCardProps) {
	const { state } = useAuth()
	const [isOwnListing, setIsOwnListing] = useState(false)
	const [isFavorite, setIsFavorite] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (state.user && userId) {
			console.log('Current user:', state.user._id)
			console.log('Listing user:', userId)
			setIsOwnListing(state.user._id === userId)
			
			// Kullanıcının favorilerini kontrol et
			const checkFavorite = async () => {
				try {
					// Token'ı localStorage'dan al
					const token = localStorage.getItem('token')
					console.log('LocalStorage token:', token ? token.substring(0, 30) + '...' : 'Token yok')
					
					if (!token) {
						console.error('Token bulunamadı!')
						return
					}
					
					// Direct fetch kullanacağız
					const response = await fetch('/api/favorites', {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					})
					
					const data = await response.json()
					console.log('GET /api/favorites yanıtı:', data)
					
					if (data.success && data.favorites) {
						console.log('Favori listesi:', data.favorites)
						console.log('İlan ID:', _id)
						setIsFavorite(data.favorites.includes(_id))
						
						// Favori durumunu console'a yazdır
						const favStatus = data.favorites.includes(_id)
						console.log('İlan favorilerde mi?', favStatus)
					} else if (!data.success) {
						console.error('Favorileri getirme hatası:', data.message)
					}
				} catch (error) {
					console.error('Favorileri getirme hatası:', error)
				}
			}
			
			if (state.user) {
				checkFavorite()
			}
		}
	}, [state.user, userId, _id])

	const handleToggleFavorite = async () => {
		if (!state.user) {
			alert('Favorilere eklemek için giriş yapmalısınız')
			return
		}
		
		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			console.log('POST token:', token ? token.substring(0, 30) + '...' : 'Token yok')
			
			if (!token) {
				alert('Oturum bulunamadı! Lütfen tekrar giriş yapın.')
				setLoading(false)
				return
			}
			
			console.log('İstek gönderiliyor:', {
				listingId: _id,
				action: isFavorite ? 'remove' : 'add'
			})
			
			// Direct fetch kullanacağız
			const response = await fetch('/api/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					listingId: _id,
					action: isFavorite ? 'remove' : 'add'
				})
			})
			
			const data = await response.json()
			console.log('POST /api/favorites yanıtı:', data)
			
			if (data.success) {
				setIsFavorite(!isFavorite)
				alert(isFavorite ? 'İlan izlemeden kaldırıldı' : 'İlan izlemeye alındı')
			} else {
				alert('Hata: ' + data.message)
			}
		} catch (error) {
			console.error('Favori ekleme/çıkarma hatası:', error)
			alert('İşlem sırasında bir hata oluştu')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-6 transition-all duration-200 hover:shadow-md">
			{/* Başlık Kısmı */}
			<div className="flex flex-wrap items-center gap-1 mb-4 sm:mb-8">
				<h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1">{listingTitle}</h2>
				<span className="text-gray-500 ml-2">Merkez:</span>
				<span className="font-medium text-gray-900">{location}</span>
				{isOwnListing && (
					<span className="ml-2 px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] sm:text-xs font-medium">
						Sizin İlanınız
					</span>
				)}
			</div>

			{/* Bilgi Badge'leri */}
			<div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-8">
				<InfoBadge 
					icon={<FiCalendar size={16} />} 
					label="Kuruluş" 
					value={foundingDate} 
					tooltip="İşletmenin kuruluş tarihi"
				/>
				<InfoBadge 
					icon={<FiFolder size={16} />} 
					label="Kategori" 
					value={CATEGORY_MAP[category] || category} 
					tooltip="İşletmenin faaliyet gösterdiği alan"
				/>
				<InfoBadge 
					icon={<FiDollarSign size={16} />} 
					label="Yıllık Ciro" 
					value={`${yearlySales} ₺`} 
					tooltip="Son mali yıldaki toplam ciro"
				/>
				<InfoBadge 
					icon={<FiTrendingUp size={16} />} 
					label="Yıllık Kar" 
					value={`${yearlyProfit} ₺`} 
					tooltip="Son mali yıldaki net kâr"
				/>
				<InfoBadge 
					icon={<FiUsers size={16} />} 
					label="Müşteri Sayısı" 
					value={salesCount} 
					tooltip="Toplam aktif müşteri sayısı"
				/>
				<InfoBadge 
					icon={<FiTag size={16} />} 
					label="Fiyat" 
					value={`${price} ₺`} 
					tooltip="Satış için istenen bedel"
				/>
			</div>

			{/* Başlık ve Doğrulama Badge */}
			<div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
				<StatusBadge status={status} />
			</div>

			{/* Açıklama */}
			<p className="text-[12px] sm:text-[13.5px] leading-relaxed text-gray-600 mb-4 sm:mb-6">
				{window.innerWidth < 640 
					? `${listingDescription.slice(0, 150)}...` 
					: `${listingDescription.slice(0, 300)}...`
				}
			</p>

			{/* Alt Butonlar */}
			<div className="flex flex-wrap items-center gap-3 sm:gap-8 pt-3 sm:pt-4 border-t border-gray-100">
				<button 
					className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
					onClick={() => router.push(`/listings/${_id}`)}
				>
					<FiEye className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
					<span className="text-[12px] sm:text-[13.5px]">Detaylar</span>
				</button>
				<button 
					className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
					onClick={handleToggleFavorite}
					disabled={loading}
				>
					<FiHeart 
						className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
					/>
					<span className="text-[12px] sm:text-[13.5px]">
						{isFavorite ? 'İzlemeden Çıkar' : 'İzlemeye Al'}
					</span>
				</button>
			</div>
		</div>
	)
}