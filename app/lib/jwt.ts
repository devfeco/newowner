import { IUser } from './types'
import { jwtDecode } from 'jwt-decode'

const JWT_SECRET = process.env.JWT_SECRET || 'newowner_jwt_secret_key'

// API tarafında token oluşturma
export const generateToken = (user: any): string => {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name || user.fullName || '',
    userType: user.userType,
    createdAt: user.createdAt
  }

  // Bu fonksiyon sunucu tarafında doğru şekilde çalışacaktır
  // Client tarafında çağrılmayacak
  try {
    // Dinamik olarak jsonwebtoken modülünü içe aktar (sadece sunucuda çalışacak)
    const jwt = require('jsonwebtoken')
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
  } catch (error) {
    console.error('Token oluşturma hatası:', error)
    return ''
  }
}

// Client tarafında token doğrulama - jwt-decode kullanarak
export const verifyToken = (token: string): { 
  id: string; 
  email: string; 
  name?: string;
  userType?: string;
  createdAt?: string;
} | null => {
  try {
    if (!token || token.trim() === '') {
      console.error('Boş token')
      return null
    }
    
    // jwt-decode ile token içeriğini çözümle (tarayıcıda çalışır)
    const decoded = jwtDecode(token)
    // Gerekli alanların varlığını kontrol et
    if (!decoded || !('id' in decoded) || !('email' in decoded)) {
      console.error('Geçersiz token yapısı')
      return null
    }
    return decoded as {
      id: string
      email: string
      name?: string
      userType?: string
      createdAt?: string
    }
  } catch (error) {
    console.error('Token çözme hatası:', error)
    return null
  }
}

export const extractUserFromToken = (token: string): IUser | null => {
  const decoded = verifyToken(token)
  if (!decoded) return null

  return {
    _id: decoded.id,
    email: decoded.email,
    name: decoded.name || '',
    fullName: decoded.name || '',
    userType: decoded.userType as ('buyer' | 'seller' | undefined),
    createdAt: decoded.createdAt
  }
}

// Token'dan kullanıcı verilerini ve geçerlilik durumunu al
// Frontend tarafında kullanılacak
export const validateAndLoadUser = async (token: string): Promise<IUser | null> => {
  try {
    if (!token || token.trim() === '') {
      console.error('Boş token, doğrulama yapılamıyor')
      return null
    }
    
    console.log('Token çözümleniyor:', token.substring(0, 15) + '...')
    
    // Token içeriğini doğrudan çözümle
    const decoded = verifyToken(token)
    
    if (!decoded) {
      console.error('Token çözümlenemedi')
      return null
    }
    
    console.log('Token çözümlendi, kullanıcı kimliği:', decoded.id)
    
    return {
      _id: decoded.id,
      email: decoded.email,
      userType: decoded.userType as ('buyer' | 'seller' | undefined),
      name: decoded.name || '',
      fullName: decoded.name || '',
      createdAt: decoded.createdAt
    }
  } catch (error) {
    console.error('Token doğrulama hatası:', error)
    return null
  }
}
