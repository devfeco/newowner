import crypto from 'crypto';

// PayTR Entegrasyon Parametreleri
interface PaytrConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  apiUrl: string;
}

// Ödeme bilgileri için interface
interface PaymentInfo {
  orderId: string;
  amount: number; // TL cinsinden, 100 kuruş = 1 TL
  basketItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  customerInfo: {
    email: string;
    name: string;
    address: string;
    phone: string;
  };
  callbackUrl: string;
  successUrl: string;
  failUrl: string;
  paymentType?: string;
}

// PayTR konfigürasyonu
const PAYTR_CONFIG: PaytrConfig = {
  merchantId: process.env.PAYTR_MERCHANT_ID || '',
  merchantKey: process.env.PAYTR_MERCHANT_KEY || '',
  merchantSalt: process.env.PAYTR_MERCHANT_SALT || '',
  apiUrl: 'https://www.paytr.com/odeme/api/get-token'
};

/**
 * PayTR iFrame API için token oluşturur
 */
export async function createPaytrToken(paymentInfo: PaymentInfo): Promise<string> {
  // Sepet bilgisi Base64 formatında
  const userBasket = paymentInfo.basketItems.map(item => 
    [item.name, item.price.toFixed(2), item.quantity].join());
  const userBasketEncoded = Buffer.from(JSON.stringify(userBasket)).toString('base64');
  
  // Ödeme tipi
  const paymentType = paymentInfo.paymentType || 'card';

  // Gerçek IP adresi (Production'da gerçek IP alınmalı)
  const userIp = '127.0.0.1';

  // Sipariş No
  const merchantOid = paymentInfo.orderId;
  
  // Toplam tutar (1.00 TL için 100 gönderilmeli)
  const paymentAmount = paymentInfo.amount;
  
  // Zaman damgası
  const timeStamp = Math.floor(Date.now() / 1000).toString();
  
  // Kullanıcı bilgileri
  const { email, name, address, phone } = paymentInfo.customerInfo;
  
  // URL'ler
  const merchantOkUrl = paymentInfo.successUrl;
  const merchantFailUrl = paymentInfo.failUrl;
  const merchantNotifyUrl = paymentInfo.callbackUrl;
  
  // Non-3D ödeme için
  const noInstallment = '1';
  const maxInstallment = '0';
  
  // Hash oluşturma
  const hashStr = `${PAYTR_CONFIG.merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasketEncoded}${noInstallment}${maxInstallment}${paymentType}${merchantOkUrl}${merchantFailUrl}${merchantNotifyUrl}${timeStamp}${PAYTR_CONFIG.merchantSalt}`;
  const paytrToken = crypto.createHmac('sha256', PAYTR_CONFIG.merchantKey).update(hashStr).digest('base64');
  
  // POST verileri
  const postData = {
    merchant_id: PAYTR_CONFIG.merchantId,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email: email,
    payment_amount: paymentAmount,
    paytr_token: paytrToken,
    user_basket: userBasketEncoded,
    debug_on: '1',
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: name,
    user_address: address,
    user_phone: phone,
    merchant_ok_url: merchantOkUrl,
    merchant_fail_url: merchantFailUrl,
    timeout_limit: '30',
    currency: 'TL',
    test_mode: '1',
    payment_type: paymentType
  };
  
  try {
    // PayTR'ye istek gönder
    const response = await fetch(PAYTR_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(postData as any).toString()
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.token;
    } else {
      throw new Error(`PayTR Hata: ${data.reason}`);
    }
  } catch (error) {
    console.error('PayTR token alma hatası:', error);
    throw error;
  }
}

/**
 * PayTR'den gelen bildirim (callback) doğrulaması
 */
export function validatePaytrCallback(requestBody: any): boolean {
  const { merchant_oid, status, total_amount, hash } = requestBody;
  
  // Hash kontrolü
  const hashStr = `${merchant_oid}${PAYTR_CONFIG.merchantSalt}${status}${total_amount}`;
  const calculatedHash = crypto.createHmac('sha256', PAYTR_CONFIG.merchantKey).update(hashStr).digest('base64');
  
  return hash === calculatedHash;
} 