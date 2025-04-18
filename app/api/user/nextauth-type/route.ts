import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/app/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, userType } = await request.json()
    
    if (!email || !userType) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email ve kullanıcı tipi gereklidir' 
      }, { status: 400 })
    }
    
    if (!['buyer', 'seller'].includes(userType)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Geçersiz kullanıcı tipi. "buyer" veya "seller" olmalıdır.' 
      }, { status: 400 })
    }
    
    // MongoDB'ye bağlan
    const { db } = await connectToDatabase()
    
    // Kullanıcıyı bul ve güncelle
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { userType, updatedAt: new Date() } }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Kullanıcı bulunamadı' 
      }, { status: 404 })
    }
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Kullanıcı tipi zaten güncel' 
      }, { status: 200 })
    }
    
    // Güncellenen kullanıcıyı döndür
    const updatedUser = await db.collection('users').findOne({ email })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Kullanıcı tipi güncellendi',
      user: updatedUser
    })
  } catch (error: any) {
    console.error('NextAuth kullanıcı tipi güncelleme hatası:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Bir hata oluştu'
    }, { status: 500 })
  }
} 