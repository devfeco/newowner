import { NextResponse } from 'next/server'
import { dbConnect } from '@/app/lib/mongodb'
import Listing from '@/app/models/Listing'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    await dbConnect()

    // Token kontrolü - Header'dan alma
    const authHeader = request.headers.get('Authorization')
    
    // Bearer token formatını al
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null
    
    let requestData
    try {
      const requestClone = request.clone()
      requestData = await requestClone.json()
    } catch (error) {
      requestData = null
    }
    
    const userToken = token || requestData?.token
    
    if (!userToken) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }
    
    // JWT doğrulama
    const secret = process.env.JWT_SECRET || 'newowner_jwt_secret_key'
    let decoded
    
    try {
      decoded = jwt.verify(userToken, secret) as { id: string }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz oturum' },
        { status: 401 }
      )
    }
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz kullanıcı bilgisi' },
        { status: 401 }
      )
    }

    // İstek gövdesinden form verilerini al
    const formData = requestData || await request.json()
    
    // Form verilerini doğrulama
    if (!formData) {
      return NextResponse.json(
        { success: false, message: 'Form verileri bulunamadı' },
        { status: 400 }
      )
    }

    if (!formData.brandName || !formData.category || !formData.price) {
      return NextResponse.json(
        { success: false, message: 'Gerekli alanları doldurun: marka adı, kategori ve fiyat' },
        { status: 400 }
      )
    }
    
    // Kullanıcı ID'sini ekle
    const listingData = {
      ...formData,
      userId: decoded.id
    }
    
    // MongoDB'ye kaydet
    const newListing = new Listing(listingData)
    await newListing.save()
    
    return NextResponse.json({
      success: true,
      message: 'İlan başarıyla oluşturuldu',
      data: {
        id: newListing._id,
        title: newListing.brandName,
        createdAt: newListing.createdAt
      }
    })
    
  } catch (error: any) {
    console.error('İlan oluşturma hatası:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Bir hata oluştu' },
      { status: 500 }
    )
  }
} 