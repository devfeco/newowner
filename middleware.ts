import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Giriş yapılmadan görüntülenebilecek sayfalar
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/welcome',
  '/landing',
  '/pricing',
  '/about'
]

const isListingDetailPage = (pathname: string) => {
  return /^\/listings\/[^\/]+$/.test(pathname)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // API rotaları için middleware çalıştırma
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }
  
  // Statik dosyalar için middleware çalıştırma
  if (pathname.includes('/_next') || pathname.includes('/favicon.ico')) {
    return NextResponse.next()
  }
  
  if (PUBLIC_ROUTES.includes(pathname) || isListingDetailPage(pathname)) {
    return NextResponse.next()
  }
  
  const token = request.cookies.get('token')?.value
  
  if (!token) {
    console.log(`Yetkisiz erişim, kullanıcı /welcome sayfasına yönlendiriliyor: ${pathname}`)
    const url = request.nextUrl.clone()
    url.pathname = '/welcome'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
} 