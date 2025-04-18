import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

export async function GET(request: Request) {
  try {
    console.log('Google info API çağrıldı')
    // Get session from Next-Auth
    const session = await getServerSession(authOptions)
    
    console.log('Session bilgisi:', session?.user?.email || 'Oturum bulunamadı')
    
    if (!session || !session.user) {
      console.error('Oturum bulunamadı')
      return NextResponse.json({
        success: false,
        message: 'Oturum bulunamadı',
        email: null
      }, { status: 401 })
    }
    
    console.log(`Kullanıcı bilgisi bulundu: ${session.user.email}`)
    
    // Session'dan kullanıcı bilgisini döndür
    return NextResponse.json({
      success: true,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image
    })
  } catch (error: any) {
    console.error('Session bilgisi alma hatası:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Oturum bilgisi alınamadı',
      email: null
    }, { status: 500 })
  }
} 