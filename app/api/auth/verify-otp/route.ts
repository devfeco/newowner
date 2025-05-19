import { NextRequest, NextResponse } from 'next/server';
import { validateAndLoadUser } from '@/app/lib/jwt';
import { dbConnect } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import OTP from '@/app/models/OTP';

// OTP kodlarını geçici olarak saklamak için
// Gerçek uygulamada bu veriler veritabanında saklanmalı
// Bu değişken send-otp route ile paylaşılmalı, burada tekrar tanımlanması sadece örnek amaçlıdır
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
    const { phoneNumber, otp } = body;
    
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: 'Telefon numarası ve doğrulama kodu gereklidir' },
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
    
    // OTP'yi veritabanından kontrol et
    const otpRecord = await OTP.findOne({ 
      userId: user._id,
      phoneNumber: formattedPhone,
      isVerified: false
    });
    
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz telefon numarası veya süresi dolmuş kod' },
        { status: 400 }
      );
    }
    
    // OTP süresi dolmuş mu kontrol et
    if (new Date() > otpRecord.expiresAt) {
      // Süresi dolmuş OTP'yi sil
      await OTP.deleteOne({ _id: otpRecord._id });
      
      return NextResponse.json(
        { success: false, message: 'Doğrulama kodunun süresi dolmuş, lütfen yeni kod isteyin' },
        { status: 400 }
      );
    }
    
    // OTP doğru mu kontrol et
    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz doğrulama kodu' },
        { status: 400 }
      );
    }
    
    // OTP doğrulandı, kullanıcının telefon numarasını doğrulanmış olarak işaretle
    await User.findByIdAndUpdate(user._id, { 
      phoneNumber: formattedPhone,
      isPhoneVerified: true
    });
    
    // OTP'yi doğrulanmış olarak işaretle
    await OTP.findByIdAndUpdate(otpRecord._id, { isVerified: true });
    
    return NextResponse.json({
      success: true,
      message: 'Telefon numarası başarıyla doğrulandı',
      phoneNumber: formattedPhone
    });
  } catch (error: any) {
    console.error('OTP doğrulama hatası:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 