import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import Appointment from '@/app/models/Appointment'
import { verifyToken } from '@/app/lib/jwt'

type RouteParams = {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
    { params }: RouteParams
) {
  try {
    await dbConnect()
    const id = params.id
    
    // Randevuyu bul
    const appointment = await Appointment.findById(id)
    
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
    console.error('Randevu getirme hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Randevu getirilirken bir hata oluştu.'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
    { params }: RouteParams
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
    
    const decoded = await verifyToken(token)
    
    // Mevcut randevuyu kontrol et
    const appointment = await Appointment.findById(id)
    
    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: 'Randevu bulunamadı'
      }, { status: 404 })
    }
    
    // Sadece randevuyu oluşturan kişi veya admin güncelleyebilir
    if (appointment.userId && appointment.userId.toString() !== decoded?.id && decoded?.userType !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      }, { status: 403 })
    }
    
    // Randevuyu güncelle
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
    
    return NextResponse.json({
      success: true,
      appointment: updatedAppointment
    })
    
  } catch (error: any) {
    console.error('Randevu güncelleme hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Randevu güncellenirken bir hata oluştu.'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await dbConnect()
    const id = params.id
    
    // Token kontrolü
    const token = request.headers.get('Authorization')?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Yetkilendirme hatası'
      }, { status: 401 })
    }
    
    const decoded = await verifyToken(token)
    
    // Mevcut randevuyu kontrol et
    const appointment = await Appointment.findById(id)
    
    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: 'Randevu bulunamadı'
      }, { status: 404 })
    }
    // Sadece randevuyu oluşturan kişi veya admin silebilir
    if (appointment.userId && appointment.userId.toString() !== decoded?.id && decoded?.userType !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      }, { status: 403 })
    }
    
    // Randevuyu sil
    await Appointment.findByIdAndDelete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Randevu başarıyla silindi'
    })
    
  } catch (error: any) {
    console.error('Randevu silme hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Randevu silinirken bir hata oluştu.'
    }, { status: 500 })
  }
} 