import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/app/lib/mongodb'
import { generateToken } from '@/app/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Cookie'lerden session token'ını al
    const cookieStore = cookies()
    const sessionCookie = (await cookieStore).get('next-auth.session-token')
    
    if (!sessionCookie) {
      console.error('Session cookie bulunamadı')
      return NextResponse.json({
        success: false,
        message: 'Oturum bulunamadı'
      }, { status: 401 })
    }
    
    // User-Agent bilgisinden tarayıcı bilgilerini al
    const userAgent = request.headers.get('user-agent') || ''
    
    // Referrer bilgisi
    const referer = request.headers.get('referer') || ''
    
    // Query string'den email bilgisini al
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email parametresi gereklidir'
      }, { status: 400 })
    }
    
    console.log(`Email: ${email}, Session cookie: ${sessionCookie.value.substring(0, 15)}...`)
    console.log(`User agent: ${userAgent.substring(0, 50)}...`)
    console.log(`Referer: ${referer}`)
    
    const { db } = await connectToDatabase()
    
    // Email adresine göre kullanıcıyı bul
    const user = await db.collection('users').findOne({ email })
    
    if (!user) {
      console.error(`Kullanıcı bulunamadı: ${email}`)
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı veritabanında bulunamadı'
      }, { status: 404 })
    }
    
    console.log(`Kullanıcı bulundu: ${email}`)
    
    // JWT token oluştur
    const token = generateToken(user)
    
    if (!token) {
      console.error('Token oluşturulamadı')
      return NextResponse.json({
        success: false,
        message: 'Token oluşturulamadı'
      }, { status: 500 })
    }
    
    console.log(`Token oluşturuldu: ${token.substring(0, 15)}...`)
    
    // Kullanıcı bilgilerini ve token'ı döndür
    return NextResponse.json({
      success: true,
      message: 'Token başarıyla oluşturuldu',
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
    console.error('Session token oluşturma hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Bir hata oluştu'
    }, { status: 500 })
  }
} 