import { NextRequest, NextResponse } from 'next/server';
import { sendOTP, generateOTP } from '@/app/lib/twilioService';
import { validateAndLoadUser } from '@/app/lib/jwt';
import { dbConnect } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import OTP from '@/app/models/OTP';

// OTP kodlarını geçici olarak saklamak için
// Gerçek uygulamada bu veriler veritabanında saklanmalı
const otpStore: Record<string, { otp: string, expiresAt: Date }> = {};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Authorization header'dan token'ı al
    const authHeader = req.headers.get('authorization');
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    if (!token) {
      // Cookie'den token'ı al
      const cookies = req.cookies;
      token = cookies.get('token')?.value || '';
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }
    
    // Token'ı doğrula ve kullanıcı bilgilerini al
    const user = await validateAndLoadUser(token);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz oturum. Lütfen tekrar giriş yapın.' },
        { status: 401 }
      );
    }
    
    // İstek gövdesini al
    const body = await req.json();
    const { phoneNumber } = body;
    
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Telefon numarası gereklidir' },
        { status: 400 }
      );
    }
    
    // Telefon numarasını formatla (uluslararası format)
    let formattedPhone = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      // Türkiye için varsayılan kod ekle
      formattedPhone = phoneNumber.startsWith('0') 
        ? '+9' + phoneNumber 
        : '+90' + phoneNumber;
    }
    
    // OTP oluştur
    const otp = generateOTP();
    
    // OTP'nin geçerlilik süresini belirle (5 dakika)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    
    // Önceki OTP'leri iptal et
    await OTP.deleteMany({ userId: user._id, phoneNumber: formattedPhone });
    
    // Yeni OTP'yi veritabanına kaydet
    await OTP.create({
      userId: user._id,
      phoneNumber: formattedPhone,
      otp,
      expiresAt,
      isVerified: false
    });
    
    // OTP gönder
    const result = await sendOTP(formattedPhone, otp);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'OTP gönderilirken bir hata oluştu' },
        { status: 500 }
      );
    }
    
    // Kullanıcının telefon numarasını güncelle (henüz doğrulanmadı)
    await User.findByIdAndUpdate(user._id, { phoneNumber: formattedPhone });
    
    return NextResponse.json({
      success: true,
      message: 'Doğrulama kodu gönderildi',
      expiresAt
    });
  } catch (error: any) {
    console.error('OTP gönderme hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 