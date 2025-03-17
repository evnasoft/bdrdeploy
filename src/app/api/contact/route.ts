import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // E-posta gönderimi
    await resend.emails.send({
      from: 'BDR Spare Parts <info@bdrspareparts.com>',
      to: ['info@bdrspareparts.com'],
      subject: `Yeni İletişim Formu: ${subject}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `
    })

    return NextResponse.json(
      { message: 'Mesajınız başarıyla gönderildi.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('İletişim formu hatası:', error)
    return NextResponse.json(
      { error: 'Mesaj gönderilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
} 