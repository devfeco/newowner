import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/app/lib/mongodb'
import User from '@/app/models/User'
import { generateToken } from '@/app/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { name, email, password } = await request.json()
    
    // Zorunlu alanları kontrol et
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Tüm alanların doldurulması zorunludur' },
        { status: 400 }
      )
    }
    
    // Email kontrolü
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }
    
    // Yeni kullanıcı oluştur
    const user = await User.create({
      fullName: name,
      email,
      password
    })
    
    // Şifreyi gizle
    user.password = undefined
    
    // JWT token oluştur
    const token = generateToken(user.toObject())
    
    return NextResponse.json(
      {
        success: true,
        message: 'Kayıt başarılı',
        user,
        token
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Kayıt hatası:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Kayıt işlemi başarısız' },
      { status: 500 }
    )
  }
} 