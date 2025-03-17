import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Tüm kategorileri getir
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Kategoriler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Kategoriler getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Yeni kategori ekle
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        parentId: body.parentId || null,
      },
      include: {
        parent: true,
        children: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Kategori eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kategori eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 