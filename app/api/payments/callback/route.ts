import { NextRequest, NextResponse } from 'next/server';
import { validatePaytrCallback } from '@/app/lib/paytr';
import { updatePaymentStatus } from '@/app/lib/paymentService';

// PayTR Callback API
export async function POST(req: NextRequest) {
  try {
    // Form verilerini al
    const formData = await req.formData();
    const requestBody: Record<string, any> = {};
    
    // FormData'dan değerleri çıkart
    formData.forEach((value, key) => {
      requestBody[key] = value;
    });
    
    // PayTR'den gelen bildirimi doğrula
    const isValid = validatePaytrCallback(requestBody);
    
    if (!isValid) {
      console.error('Geçersiz PayTR callback bildirimi:', requestBody);
      return NextResponse.json(
        { error: 'Geçersiz bildirim' },
        { status: 400 }
      );
    }
    
    // Ödeme sonucunu al
    const { merchant_oid: orderId, status, total_amount: amount } = requestBody;
    
    // Ödeme durumunu güncelle
    await updatePaymentStatus({
      orderId,
      status: status === 'success' ? 'success' : 'failed',
      amount: parseInt(amount, 10)
    });
    
    // PayTR'ye başarılı yanıt döndür (Bu önemli)
    return new NextResponse('OK');
  } catch (error: any) {
    console.error('Ödeme callback endpoint hatası:', error);
    
    // Hata durumunda bile PayTR'ye başarılı yanıt döndür
    // Bu, PayTR'nin bildirimi tekrar göndermesini engeller
    return new NextResponse('OK');
  }
} 