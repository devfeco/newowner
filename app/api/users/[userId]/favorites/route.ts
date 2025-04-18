import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/app/lib/mongodb'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

type Params = Promise<{ userId: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const userId = (await params).userId
    
    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı başarısız' }, { status: 500 })
    }
    
    // Kullanıcıyı bul
    const user = await db.collection('users').findOne(
      { _id: new mongoose.Types.ObjectId(userId) }
    )
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Kullanıcı bulunamadı' 
      }, { status: 404 })
    }
    
    // Favorileri al (yoksa boş array)
    const favorites = user.favorites || []
    
    if (!favorites.length) {
      return NextResponse.json({
        success: true,
        favorites: []
      })
    }
    
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
    
    return NextResponse.json({
      success: true,
      favorites: favoriteListings
    })
    
  } catch (error) {
    console.error('Favori ilanları getirme hatası:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Favori ilanları getirirken bir hata oluştu'
    }, { status: 500 })
  }
} 