'use client'

import { FiEye, FiHeart, FiMessageSquare } from 'react-icons/fi'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'
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
	icon: string
	label: string
	value: string
}

function InfoBadge({ icon, label, value }: InfoBadgeProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="w-8 h-8 rounded-lg bg-[#6941C6] flex items-center justify-center text-white rounded-full">
				{icon}
			</div>
			<div>
				<p className="text-[13px] text-gray-500">{label}</p>
				<p className="text-[13.5px] font-medium text-gray-900">{value}</p>
			</div>
		</div>
	)
}

interface StatusBadgeProps {
	status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<span className={`px-2 py-1 rounded-full text-[12px] font-medium ${
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
	brandName: string
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
	brandName,
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
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
			{/* Başlık Kısmı */}
			<div className="flex items-center gap-1 mb-8 text-[15px]">
				<span className="text-gray-500">Marka:</span>
				<span className="font-medium text-gray-900">{brandName}</span>
				<span className="text-gray-500 ml-2">Merkez:</span>
				<span className="font-medium text-gray-900">{location}</span>
				{isOwnListing && (
					<span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
						Sizin İlanınız
					</span>
				)}
			</div>

			{/* Bilgi Badge'leri */}
			<div className="flex flex-wrap items-center gap-6 mb-8">
				<InfoBadge icon="K" label="Kuruluş" value={foundingDate} />
				<InfoBadge icon="K" label="Kategori" value={CATEGORY_MAP[category] || category} />
				<InfoBadge icon="Y" label="Yıllık Ciro" value={`${yearlySales} ₺`} />
				<InfoBadge icon="Y" label="Yıllık Kar" value={`${yearlyProfit} ₺`} />
				<InfoBadge icon="M" label="Müşteri Sayısı" value={salesCount} />
				<InfoBadge icon="F" label="Fiyat" value={`${price} ₺`} />
			</div>

			{/* Başlık ve Doğrulama Badge */}
			<div className="flex items-center gap-2 mb-3">
				<h3 className="text-[15px] font-medium text-gray-900">
					{brandName}
				</h3>
				<StatusBadge status={status} />
			</div>

			{/* Açıklama */}
			<p className="text-[13.5px] leading-relaxed text-gray-600 mb-6">{listingDescription.slice(0, 300)}...</p>

			{/* Alt Butonlar */}
			<div className="flex items-center gap-8 pt-4 border-t border-gray-100">
				<button 
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					onClick={() => router.push(`/listings/${_id}`)}
				>
					<FiEye className="w-[18px] h-[18px]" />
					<span className="text-[13.5px]">Detaylar</span>
				</button>
				<button 
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					onClick={handleToggleFavorite}
					disabled={loading}
				>
					<FiHeart 
						className={`w-[18px] h-[18px] ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
					/>
					<span className="text-[13.5px]">
						{isFavorite ? 'İzlemeden Çıkar' : 'İzlemeye Al'}
					</span>
				</button>
				<button className="flex items-center gap-2 text-[#6941C6] hover:text-[#5730a3]">
					<FiMessageSquare className="w-[18px] h-[18px]" />
					<span className="text-[13.5px]">Satıcı İle İletişime Geç</span>
				</button>
			</div>
		</div>
	)
}