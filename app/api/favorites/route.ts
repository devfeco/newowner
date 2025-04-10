import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

// Token'dan kullanıcı bilgilerini çıkar
const getUserFromToken = (req: NextRequest) => {
	try {
		const token = req.headers.get('authorization')?.split(' ')[1]
		
		if (!token) {
			return null
		}
		
		const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
		console.log('Çözülen token:', decodedToken)
		
		if (!decodedToken || !decodedToken.email) {
			return null
		}
		
		return decodedToken.email
	} catch (error) {
		console.error('Token çözme hatası:', error)
		return null
	}
}

// GET: Kullanıcının favorilerini getir
export async function GET(req: NextRequest) {
	try {
		// Token'dan email al
		const userEmail = getUserFromToken(req)
		console.log('Kullanıcı email:', userEmail)
		
		if (!userEmail) {
			return NextResponse.json({ 
				success: false, 
				message: 'Kullanıcı kimliği doğrulanamadı' 
			}, { status: 401 })
		}
		
		// Veritabanına bağlan
		await dbConnect()
		const db = mongoose.connection.db
		if (!db) {
			return NextResponse.json({ error: 'Veritabanı bağlantısı başarısız' }, { status: 500 })
		}
		
		// Email ile kullanıcıyı bul
		const user = await db.collection('users').findOne({ email: userEmail })
		console.log('Bulunan kullanıcı:', user ? user._id : 'Kullanıcı bulunamadı')
		
		if (!user) {
			return NextResponse.json({ 
				success: false, 
				message: 'Kullanıcı bulunamadı' 
			}, { status: 404 })
		}
		
		// Favorileri array olarak döndür (yoksa boş array)
		return NextResponse.json({
			success: true,
			favorites: user.favorites || []
		})
		
	} catch (error) {
		console.error('GET /api/favorites hatası:', error)
		return NextResponse.json({ 
			success: false, 
			message: 'Favorileri getirirken bir hata oluştu'
		}, { status: 500 })
	}
}

// POST: Favori ekle/çıkar
export async function POST(req: NextRequest) {
	try {
		// Token'dan email al
		const userEmail = getUserFromToken(req)
		console.log('Kullanıcı email:', userEmail)
		
		if (!userEmail) {
			return NextResponse.json({ 
				success: false, 
				message: 'Kullanıcı kimliği doğrulanamadı'
			}, { status: 401 })
		}
		
		// Request verilerini al
		const { listingId, action } = await req.json()
		console.log('İstek verileri:', { listingId, action })
		
		if (!listingId || !action || (action !== 'add' && action !== 'remove')) {
			return NextResponse.json({ 
				success: false, 
				message: 'Geçersiz istek verileri'
			}, { status: 400 })
		}
		
		// Veritabanına bağlan
		await dbConnect()
		const db = mongoose.connection.db
		if (!db) {
			return NextResponse.json({ error: 'Veritabanı bağlantısı başarısız' }, { status: 500 })
		}
		
		// Email ile kullanıcıyı bul
		const user = await db.collection('users').findOne({ email: userEmail })
		console.log('Bulunan kullanıcı:', user ? user._id : 'Kullanıcı bulunamadı')
		
		if (!user) {
			return NextResponse.json({ 
				success: false, 
				message: 'Kullanıcı bulunamadı'
			}, { status: 404 })
		}
		
		// Mevcut favorileri al (yoksa boş dizi)
		const currentFavorites = user.favorites || []
		
		// İşleme göre güncelle
		let updatedFavorites
		if (action === 'add') {
			// Eğer zaten favorilerde varsa, tekrar ekleme
			if (currentFavorites.includes(listingId)) {
				return NextResponse.json({
					success: true,
					message: 'İlan zaten favorilerde',
					favorites: currentFavorites
				})
			}
			updatedFavorites = [...currentFavorites, listingId]
		} else {
			// Favorilerden çıkar
			updatedFavorites = currentFavorites.filter((id: string) => id !== listingId)
		}
		
		// Kullanıcı favorilerini güncelle
		const result = await db.collection('users').updateOne(
			{ email: userEmail },
			{ $set: { favorites: updatedFavorites } }
		)
		
		console.log('Güncelleme sonucu:', result)
		
		if (result.modifiedCount === 0 && result.matchedCount > 0) {
			return NextResponse.json({
				success: true,
				message: 'Değişiklik yapılmadı (muhtemelen zaten güncel)',
				favorites: updatedFavorites
			})
		}
		
		if (result.modifiedCount === 0) {
			return NextResponse.json({
				success: false,
				message: 'Favoriler güncellenemedi'
			}, { status: 500 })
		}
		
		return NextResponse.json({
			success: true,
			message: action === 'add' ? 'İlan favorilere eklendi' : 'İlan favorilerden çıkarıldı',
			favorites: updatedFavorites
		})
		
	} catch (error) {
		console.error('POST /api/favorites hatası:', error)
		return NextResponse.json({ 
			success: false, 
			message: 'Favorileri güncellerken bir hata oluştu'
		}, { status: 500 })
	}
} 