import { NextRequest, NextResponse } from 'next/server'
import {dbConnect} from '@/app/lib/mongodb'
import User from '@/app/models/User'
const jwt = require('jsonwebtoken')
import { generateToken } from '@/app/lib/jwt'

// Sunucu tarafında token doğrulama (client tarafındaki verifyToken yerine)
const verifyTokenServer = (token: string) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'newowner_jwt_secret_key'
    return jwt.verify(token, JWT_SECRET) as {
      id: string
      email: string
      name?: string
      userType?: string
      createdAt?: string
    }
  } catch (error) {
    console.error('Token doğrulama hatası (sunucu):', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // Token'ı al
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }
    
    // Token'ı doğrula (sunucu tarafında)
    const decoded = verifyTokenServer(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz veya süresi dolmuş token' },
        { status: 401 }
      )
    }
    
    const { userType } = await request.json()
    
    // userType alanını kontrol et
    if (!userType || !['buyer', 'seller'].includes(userType)) {
      return NextResponse.json(
        { success: false, message: 'Geçerli bir kullanıcı tipi belirtilmedi' },
        { status: 400 }
      )
    }
    
    // Kullanıcıyı bul ve güncelle
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { userType },
      { new: true, runValidators: true }
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }
    
    // Güncellenmiş kullanıcı bilgileriyle yeni token oluştur
    const newToken = generateToken(user.toObject())
    
    return NextResponse.json(
      {
        success: true,
        message: 'Kullanıcı tipi güncellendi',
        user,
        token: newToken
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Kullanıcı tipi güncelleme hatası:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Kullanıcı tipi güncelleme işlemi başarısız' },
      { status: 500 }
    )
  }
} 