import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123' // Bu şifreyi güvenli bir şekilde saklamalısınız

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Başarılı giriş
      const response = NextResponse.json({ success: true })
      
      // Admin token oluştur (gerçek uygulamada JWT gibi güvenli bir token kullanılmalı)
      response.cookies.set('admin_token', 'admin_session_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 saat
      })

      return response
    }

    return NextResponse.json(
      { error: 'Kullanıcı adı veya şifre hatalı' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login hatası:', error)
    return NextResponse.json(
      { error: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 