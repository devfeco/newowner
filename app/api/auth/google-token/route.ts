import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/app/lib/mongodb'
import { generateToken } from '@/app/lib/jwt'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email adresi gereklidir'
      }, { status: 400 })
    }
    
    // MongoDB'ye bağlan
    const { db } = await connectToDatabase()
    
    // Email adresine göre kullanıcıyı bul
    const user = await db.collection('users').findOne({ email })
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      }, { status: 404 })
    }
    
    // JWT token oluştur
    const token = generateToken(user)
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Token oluşturulamadı'
      }, { status: 500 })
    }
    
    // Kullanıcı ve token bilgilerini döndür
    return NextResponse.json({
      success: true,
      message: 'Google ile giriş başarılı',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        userType: user.userType,
        provider: user.provider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    })
  } catch (error: any) {
    console.error('Google token oluşturma hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Bir hata oluştu'
    }, { status: 500 })
  }
} 