import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/app/lib/mongodb'
import User from '@/app/models/User'
import Listing from '@/app/models/Listing'
import { extractUserFromToken } from '@/app/lib/jwt'
import { cookies, headers } from 'next/headers'
import mongoose from 'mongoose'

// Token'ı headerdan al
const getTokenFromRequest = (request: Request) => {
  // Authorization header'dan Bearer token'ı alıyoruz
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Cookie header'dan token'ı al
  const cookie = request.headers.get('cookie')
  if (cookie) {
    const tokenMatch = cookie.match(/token=([^;]+)/)
    if (tokenMatch && tokenMatch[1]) {
      return tokenMatch[1]
    }
  }
  
  return null
}

// Favorileri getir
export async function GET(req: NextRequest) {
  try {
    // URL'den email parametresini al
    const url = new URL(req.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email parametresi eksik' 
      }, { status: 400 })
    }
    
    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı başarısız' }, { status: 500 })
    }
    
    console.log(`Email ile kullanıcı aranıyor: ${email}`)
    
    // Email ile kullanıcıyı bul
    const user = await db.collection('users').findOne({ email })
    
    if (!user) {
      console.log(`Kullanıcı bulunamadı: ${email}`)
      return NextResponse.json({ 
        success: false, 
        message: 'Kullanıcı bulunamadı' 
      }, { status: 404 })
    }
    
    console.log(`Kullanıcı bulundu: ${user._id}`)
    
    // Favorileri al (yoksa boş array)
    const favorites = user.favorites || []
    
    if (!favorites.length) {
      console.log('Kullanıcının favorileri yok')
      return NextResponse.json({
        success: true,
        favorites: []
      })
    }
    
    console.log(`Kullanıcının ${favorites.length} adet favorisi var`)
    
    // Favori ilan ID'lerini ObjectId'ye dönüştür
    const favoriteObjectIds = favorites.map((id: string) => {
      try {
        return new mongoose.Types.ObjectId(id)
      } catch (err) {
        console.error('Geçersiz ID formatı:', id)
        return null
      }
    }).filter(Boolean)
    
    // Favorileri getir
    const favoriteListings = await db.collection('listings')
      .find({ 
        _id: { $in: favoriteObjectIds },
        isApproved: true 
      })
      .toArray()
    
    console.log(`${favoriteListings.length} adet favori ilan bulundu ve döndürülüyor`)
    
    return NextResponse.json({
      success: true,
      favorites: favoriteListings
    })
    
  } catch (error) {
    console.error('Email ile favori ilanları getirme hatası:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Favori ilanları getirirken bir hata oluştu'
    }, { status: 500 })
  }
}

// Favorilere ekle/çıkar
export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { listingId, action } = body
    
    console.log('POST isteği alındı:', { listingId, action })
    
    if (!listingId || !action || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz istek' 
      }, { status: 400 })
    }
    
    // Token'ı al
    const token = getTokenFromRequest(request)
    console.log('Alınan token:', token ? token.substring(0, 15) + '...' : 'Token bulunamadı')
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Oturum açmanız gerekiyor' 
      }, { status: 401 })
    }
    
    // Token'dan kullanıcı bilgisini çıkar
    const userData = extractUserFromToken(token)
    console.log('Kullanıcı bilgisi:', userData)
    
    if (!userData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz oturum' 
      }, { status: 401 })
    }
    
    // İlanı kontrol et - string ID'yi ObjectId'ye çevir
    let mongoListingId;
    try {
      mongoListingId = new mongoose.Types.ObjectId(listingId);
    } catch (error) {
      console.error('Geçersiz ObjectId formatı:', listingId)
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz ilan ID formatı' 
      }, { status: 400 })
    }
    
    // İlan var mı kontrol et
    const listing = await Listing.findById(mongoListingId)
    if (!listing) {
      return NextResponse.json({ 
        success: false, 
        error: 'İlan bulunamadı' 
      }, { status: 404 })
    }
    
    console.log('İlan bulundu:', listing._id)
    
    // Kullanıcıyı bul ve güncelle
    if (action === 'add') {
      // Favorilere ekle
      const result = await User.updateOne(
        { _id: userData._id },
        { $addToSet: { favorites: mongoListingId } }
      )
      
      console.log('Add sonucu:', result)
      
      return NextResponse.json({ 
        success: true,
        message: 'İlan favorilere eklendi',
        result: result
      })
    } else {
      // Favorilerden çıkar
      const result = await User.updateOne(
        { _id: userData._id },
        { $pull: { favorites: mongoListingId } }
      )
      
      console.log('Remove sonucu:', result)
      
      return NextResponse.json({ 
        success: true,
        message: 'İlan favorilerden çıkarıldı',
        result: result
      })
    }
  } catch (error) {
    console.error('Favori işlemi hatası:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 })
  }
} 