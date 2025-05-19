import { NextRequest, NextResponse } from 'next/server';
import { initiatePayment, PREMIUM_PLANS } from '@/app/lib/paymentService';
import { validateAndLoadUser } from '@/app/lib/jwt';

// Ödeme başlatma API
export async function POST(req: NextRequest) {
  try {
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
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }
    
    // Token'ı doğrula ve kullanıcı bilgilerini al
    const user = await validateAndLoadUser(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz oturum. Lütfen tekrar giriş yapın.' },
        { status: 401 }
      );
    }
    
    // İstek gövdesini al
    const body = await req.json();
    const { 
      isAnnual = false, 
      planType = 'monthly',
      amount = null,
      address = '', 
      phone = '' 
    } = body;
    
    // Plan ID'sini belirle (planType parametresine göre)
    let planId;
    
    if (planType === 'annual' || isAnnual) {
      planId = PREMIUM_PLANS.ANNUAL.id;
    } else if (planType === 'monthly') {
      planId = PREMIUM_PLANS.MONTHLY.id;
    } else {
      return NextResponse.json(
        { error: 'Geçersiz abonelik planı' },
        { status: 400 }
      );
    }
    
    // Ödemeyi başlat
    const paymentData = await initiatePayment({
      userId: user._id,
      planId,
      customerEmail: user.email,
      customerName: user.name,
      customerPhone: phone,
      customerAddress: address,
      isAnnual: planType === 'annual' || isAnnual
    });
    
    // Başarılı yanıt döndür
    return NextResponse.json(paymentData);
  } catch (error: any) {
    console.error('Ödeme başlatma endpoint hatası:', error);
    
    return NextResponse.json(
      { error: error.message || 'Ödeme başlatılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 