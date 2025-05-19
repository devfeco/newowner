import { createPaytrToken } from './paytr';
import { v4 as uuidv4 } from 'uuid';

// Premium üyelik planları
export const PREMIUM_PLANS = {
  MONTHLY: {
    id: 'premium_monthly',
    name: 'Premium Aylık',
    price: 3900, // 39.00 USD -> 3900 cent
    period: 'month',
    description: 'Aylık Premium Üyelik'
  },
  ANNUAL: {
    id: 'premium_annual',
    name: 'Premium Yıllık',
    price: 36000, // 360.00 USD -> 36000 cent
    period: 'year',
    description: 'Yıllık Premium Üyelik (Aylık 30 USD)'
  }
};

// Ödeme başlatma fonksiyonu
export async function initiatePayment({
  userId,
  planId,
  customerEmail,
  customerName,
  customerPhone,
  customerAddress,
  isAnnual = false
}: {
  userId: string;
  planId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  isAnnual?: boolean;
}) {
  try {
    // Plan bilgisini al
    const plan = isAnnual ? PREMIUM_PLANS.ANNUAL : PREMIUM_PLANS.MONTHLY;
    
    // Sipariş ID oluştur
    const orderId = `${userId}_${planId}_${Date.now()}`;
    
    // Callback, success ve fail URL'leri
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/payments/callback`;
    const successUrl = `${baseUrl}/payments/success`;
    const failUrl = `${baseUrl}/payments/failed`;
    
    // PayTR token oluştur
    const token = await createPaytrToken({
      orderId,
      amount: plan.price,
      basketItems: [
        {
          name: plan.name,
          price: plan.price / 100, // TL cinsinden (ör: 19.50 TL)
          quantity: 1
        }
      ],
      customerInfo: {
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        address: customerAddress
      },
      callbackUrl,
      successUrl,
      failUrl
    });
    
    // Ödeme kaydını veritabanına kaydet
    // Bu kısım veritabanı modelinize göre değişecektir
    // Örneğin MongoDB kullanıyorsanız aşağıdaki gibi olabilir:
    /*
    await db.collection('payments').insertOne({
      userId,
      orderId,
      planId: plan.id,
      amount: plan.price,
      status: 'pending',
      createdAt: new Date(),
      paytrToken: token
    });
    */
    
    // PayTR iFrame URL'i
    return {
      token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}`,
      orderId
    };
  } catch (error) {
    console.error('Ödeme başlatma hatası:', error);
    throw error;
  }
}

// Ödeme durumunu güncelleme fonksiyonu
export async function updatePaymentStatus({
  orderId,
  status,
  amount
}: {
  orderId: string;
  status: 'success' | 'failed';
  amount: number;
}) {
  try {
    // Veritabanındaki ödeme kaydını güncelle
    // Bu kısım veritabanı modelinize göre değişecektir
    
    // Başarılı ödeme durumunda premium üyeliği aktifleştir
    if (status === 'success') {
      // Kullanıcı ID'sini ve Plan ID'sini sipariş ID'sinden çıkart
      const [userId, planId] = orderId.split('_');
      
      // Plan tipini belirle
      const isAnnual = planId === PREMIUM_PLANS.ANNUAL.id;
      
      // Premium üyelik bitiş tarihini hesapla
      const now = new Date();
      const expiresAt = new Date();
      
      if (isAnnual) {
        expiresAt.setFullYear(now.getFullYear() + 1);
      } else {
        expiresAt.setMonth(now.getMonth() + 1);
      }
      
      // Kullanıcının premium üyeliğini aktifleştir
      // Bu kısım veritabanı modelinize göre değişecektir
      /*
      await db.collection('users').updateOne(
        { _id: userId },
        { 
          $set: { 
            isPremium: true,
            premiumExpiresAt: expiresAt,
            premiumPlanId: planId
          } 
        }
      );
      */
    }
    
    return { success: true };
  } catch (error) {
    console.error('Ödeme durumu güncelleme hatası:', error);
    throw error;
  }
} 