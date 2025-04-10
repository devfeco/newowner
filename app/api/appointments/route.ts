import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import Appointment from '@/app/models/Appointment'
import { verifyToken } from '@/app/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { listingId, fullName, email, phone, appointmentDate, notes } = body
    
    // Token kontrolü (varsa)
    let userId = null
    const token = request.headers.get('Authorization')?.split(' ')[1]
    
    if (token) {
      try {
        const decoded = await verifyToken(token)
        userId = decoded.userId
        
        // Kullanıcının bu liste için zaten randevusu var mı kontrol et
        const existingAppointment = await Appointment.findOne({
          listingId,
          userId: decoded.userId
        })
        
        if (existingAppointment) {
          return NextResponse.json({
            success: false,
            message: 'Bu ilan için zaten bir randevunuz bulunmaktadır. Varolan randevunuzu güncelleyebilirsiniz.'
          }, { status: 400 })
        }
      } catch (error) {
        console.error('Token doğrulama hatası:', error)
      }
    }
    
    // Aynı e-posta ile bu liste için zaten randevu var mı kontrol et
    // (Giriş yapmamış kullanıcılar için)
    if (!userId) {
      const existingAppointment = await Appointment.findOne({
        listingId,
        email
      })
      
      if (existingAppointment) {
        return NextResponse.json({
          success: false,
          message: 'Bu e-posta adresi ile bu ilan için zaten bir randevu bulunmaktadır.'
        }, { status: 400 })
      }
    }
    
    // Randevu oluştur
    const appointment = new Appointment({
      listingId,
      userId,
      fullName,
      email,
      phone,
      appointmentDate: new Date(appointmentDate),
      notes
    })
    
    await appointment.save()
    
    return NextResponse.json({
      success: true,
      appointment
    }, { status: 201 })
    
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
    const userId = decoded.userId
    
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