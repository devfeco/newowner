import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import Appointment from '@/app/models/Appointment'
import { verifyToken } from '@/app/lib/jwt'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } & { json: () => Promise<any> }
) {
  try {
    await dbConnect()
    
    const id = params.id
    const body = await request.json()
    
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
    if (!decoded || decoded.userType !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmamaktadır'
      }, { status: 403 })
    }
    
    // Durumu güncelle
    const { status } = body
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Geçersiz randevu durumu'
      }, { status: 400 })
    }
    
    // Randevuyu bul ve güncelle
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    )
    
    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: 'Randevu bulunamadı'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      appointment
    })
    
  } catch (error: any) {
    console.error('Randevu güncelleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Randevu güncellenirken bir hata oluştu'
    }, { status: 500 })
  }
} 