import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/app/lib/mongodb'
import User from '@/app/models/User'
import { generateToken } from '@/app/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email, password } = await request.json()
    
    // Zorunlu alanları kontrol et
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email ve şifre gereklidir' },
        { status: 400 }
      )
    }
    
    // Email ile kullanıcıyı bul
    const user = await User.findOne({ email }).select('+password')
    
    // Kullanıcı yoksa veya şifre eşleşmiyorsa
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }
    
    // Şifreyi gizle
    user.password = undefined
    
    // JWT token oluştur
    const token = generateToken(user.toObject())
    
    return NextResponse.json(
      {
        success: true,
        message: 'Giriş başarılı',
        user,
        token
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Giriş hatası:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Giriş işlemi başarısız' },
      { status: 500 }
    )
  }
} 