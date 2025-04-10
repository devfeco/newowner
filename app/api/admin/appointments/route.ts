import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import Appointment from '@/app/models/Appointment'
import { verifyToken } from '@/app/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Token kontrolü
    const token = request.headers.get('Authorization')?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Yetkilendirme hatası'
      }, { status: 401 })
    }
    
    // Token'ı doğrula ve kullanıcı bilgilerini al
    const decoded = await verifyToken(token)
    
    // Sadece admin kullanıcılara izin ver
    if (decoded && decoded.userType !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      }, { status: 403 })
    }
    
    // URL'den duruma göre filtreleme parametresini al
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    // Sorgu kriterlerini oluştur
    const query: any = {}
    
    // Duruma göre filtrele
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      query.status = status
    }
    
    // Randevuları getir
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: -1 })
      .populate('listingId', 'brandName location category') // İlan bilgilerini ekle
    
    return NextResponse.json({
      success: true,
      appointments
    })
    
  } catch (error: any) {
    console.error('Randevuları getirme hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Randevuları getirirken bir hata oluştu'
    }, { status: 500 })
  }
} 