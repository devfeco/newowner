import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
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
export async function GET(request: Request) {
  try {
    await dbConnect()
    
    // Token'ı al
    const token = getTokenFromRequest(request)
    console.log('GET - Alınan token:', token ? token.substring(0, 15) + '...' : 'Token bulunamadı')
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Oturum açmanız gerekiyor' 
      }, { status: 401 })
    }
    
    // Token'dan kullanıcı bilgisini çıkar
    const userData = extractUserFromToken(token)
    console.log('GET - Kullanıcı bilgisi:', userData)
    
    if (!userData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz oturum' 
      }, { status: 401 })
    }
    
    // User veritabanından favorileri al
    const user: any = await User.findById(userData._id).lean()
    console.log('GET - MongoDB kullanıcı ID araması:', userData._id)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      }, { status: 404 })
    }
    
    // Favorileri string'e çevir
    const favorites = user.favorites || []
    console.log('GET - Ham favoriler:', favorites)
    
    const favoriteIds = Array.isArray(favorites) ? favorites.map((id: any) => id.toString()) : []
    console.log('GET - String favoriler:', favoriteIds)
    
    return NextResponse.json({ 
      success: true,
      favorites: favoriteIds
    })
  } catch (error) {
    console.error('Favorileri getirme hatası:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
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