import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/app/lib/mongodb'
import Appointment from '@/app/models/Appointment'
import { verifyToken } from '@/app/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Token kontrolü
    const token = request.headers.get('Authorization')?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Yetkilendirme hatası'
      }, { status: 401 })
    }
    
    const decoded = await verifyToken(token)
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Geçersiz token'
      }, { status: 401 })
    }
    
    // Zorunlu alanları kontrol et
    const { listingId, fullName, email, phone, appointmentDate, notes } = body
    
    if (!listingId || !fullName || !email || !phone || !appointmentDate) {
      return NextResponse.json({
        success: false,
        message: 'Tüm zorunlu alanları doldurun'
      }, { status: 400 })
    }
    
    // Yeni randevu oluştur
    const newAppointment = new Appointment({
      listingId,
      userId: decoded.id,
      fullName,
      email,
      phone,
      appointmentDate,
      notes: notes || '',
      status: 'pending', // Varsayılan olarak beklemede
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Veritabanına kaydet
    await newAppointment.save()
    
    return NextResponse.json({
      success: true,
      message: 'Randevu başarıyla oluşturuldu',
      appointment: newAppointment
    })
    
  } catch (error: any) {
    console.error('Randevu oluşturma hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Randevu oluşturulurken bir hata oluştu.'
    }, { status: 500 })
  }
}

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
    
    const decoded = await verifyToken(token)
    const userId = decoded?.id
    
    // Kullanıcının randevularını getir
    const appointments = await Appointment.find({ userId }).sort({ appointmentDate: -1 })
    
    return NextResponse.json({
      success: true,
      appointments
    })
    
  } catch (error: any) {
    console.error('Randevuları getirme hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Randevuları getirirken bir hata oluştu.'
    }, { status: 500 })
  }
} 