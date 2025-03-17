import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Türkçe karakterleri değiştiren fonksiyon
const turkishToEnglish = (text: string): string => {
  const charMap: { [key: string]: string } = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C'
  }
  return text.replace(/[ıİğĞüÜşŞöÖçÇ]/g, char => charMap[char] || char)
}

// Slug oluşturan fonksiyon
const createSlug = (text: string): string => {
  return turkishToEnglish(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Kategoriler alınırken hata:', error)
    return NextResponse.json(
      { error: 'Kategoriler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Kategori adı gereklidir' },
        { status: 400 }
      )
    }

    const slug = createSlug(body.name)

    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu isimde bir kategori zaten mevcut' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
        slug,
        description: body.description?.trim(),
        isActive: true
      }
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