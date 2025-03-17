import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Admin sayfalarını kontrol et
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Burada gerçek bir auth kontrolü yapılmalı
    // Şimdilik basit bir kontrol yapıyoruz
    const isAuthenticated = request.cookies.has('admin_token')

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
} 