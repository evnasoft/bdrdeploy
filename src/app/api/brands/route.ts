import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Tüm markaları getir
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Markalar getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Markalar getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Yeni marka ekle
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        logo: body.logo,
      },
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Marka eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Marka eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 