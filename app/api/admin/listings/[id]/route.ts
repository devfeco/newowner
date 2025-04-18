import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/app/lib/mongodb'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

type Params = Promise<{ id: string }>;

// Token'dan kullanıcı bilgilerini çıkar
const getUserFromToken = (req: NextRequest) => {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    
    if (!token) {
      return null
    }
    
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
    console.log('Çözülen token:', decodedToken)
    
    return decodedToken
  } catch (error) {
    console.error('Token çözme hatası:', error)
    return null
  }
}

// İlan onaylama/reddetme (PUT)
export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Token'dan kullanıcı bilgilerini al
    const userData = getUserFromToken(req)
    console.log('Kullanıcı bilgileri:', userData)
    
    if (!userData || userData.userType !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Bu işlem için admin yetkisi gerekli'
      }, { status: 403 })
    }
    
    const listingId = (await params).id
    console.log('İşlem yapılacak ilan ID:', listingId)
    
    if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json({
        success: false,
        message: 'Geçersiz ilan ID'
      }, { status: 400 })
    }
    
    // Request verilerini al
    const { isApproved } = await req.json()
    console.log('İlan onay durumu:', isApproved)
    
    if (typeof isApproved !== 'boolean') {
      return NextResponse.json({
        success: false,
        message: 'isApproved alanı boolean tipinde olmalıdır'
      }, { status: 400 })
    }
    
    // Veritabanına bağlan
    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Veritabanı bağlantısı başarısız' 
      }, { status: 500 })
    }
    
    // İlanı güncelle
    const result = await db.collection('listings').updateOne(
      { _id: new mongoose.Types.ObjectId(listingId) },
      { $set: { isApproved, updatedAt: new Date() } }
    )
    
    console.log('Güncelleme sonucu:', result)
    
    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'İlan bulunamadı'
      }, { status: 404 })
    }
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'Herhangi bir değişiklik yapılmadı (ilan zaten aynı durumda)'
      })
    }
    
    return NextResponse.json({
      success: true,
      message: isApproved ? 'İlan onaylandı' : 'İlan reddedildi'
    })
    
  } catch (error) {
    console.error('İlan güncelleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: 'İşlem sırasında bir hata oluştu'
    }, { status: 500 })
  }
} 