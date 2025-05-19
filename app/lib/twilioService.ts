import twilio from 'twilio';

// Twilio kimlik bilgileri
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Twilio client'ı oluştur
const client = twilio(accountSid, authToken);

/**
 * Belirtilen telefon numarasına OTP gönderir
 * @param phoneNumber Telefon numarası (uluslararası formatta: +905xxxxxxxxx)
 * @param otp OTP kodu
 * @returns Twilio servisinden gelen yanıt
 */
export const sendOTP = async (phoneNumber: string, otp: string) => {
  try {
    const message = await client.messages.create({
      body: `NewOwner doğrulama kodunuz: ${otp}. Bu kodu kimseyle paylaşmayın.`,
      from: twilioPhone,
      to: phoneNumber
    });
    
    console.log(`OTP sent to ${phoneNumber}, SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Twilio OTP gönderme hatası:', error);
    return { success: false, error };
  }
};

/**
 * 6 haneli rastgele OTP kodu üretir
 * @returns 6 haneli OTP kodu
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 