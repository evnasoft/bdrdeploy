import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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
    .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire bırak
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Birden fazla tireyi tek tireye dönüştür
}

// Benzersiz slug oluşturan fonksiyon
async function generateUniqueSlug(name: string): Promise<string> {
  let slug = createSlug(name)
  let counter = 0
  let uniqueSlug = slug

  while (counter < 100) { // Sonsuz döngüyü önlemek için maksimum deneme sayısı
    try {
      const existing = await prisma.product.findUnique({
        where: { slug: uniqueSlug }
      })

      if (!existing) break

      counter++
      uniqueSlug = `${slug}-${counter}`
    } catch (error) {
      console.error('Slug kontrolü sırasında hata:', error)
      throw new Error('Slug oluşturulurken bir hata oluştu')
    }
  }

  if (counter >= 100) {
    throw new Error('Benzersiz slug oluşturulamadı')
  }

  return uniqueSlug
}

// Tüm ürünleri getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const inStock = searchParams.get('inStock') === 'true'
    const skip = (page - 1) * limit

    // Filtreleme koşullarını oluştur
    const where: Prisma.ProductWhereInput = {
      AND: [
        // Arama filtresi
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { sku: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { partNumber: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { oemNumber: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
          ]
        } : {},
        // Kategori filtresi
        category ? { categoryId: category } : {},
        // Marka filtresi
        brand ? { brandId: brand } : {},
        // Stok durumu filtresi
        inStock ? { stock: { gt: 0 } } : {}
      ]
    }

    // Toplam ürün sayısını al
    const total = await prisma.product.count({ where })

    // Ürünleri getir
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    })
  } catch (error) {
    console.error('Ürünler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ürünler getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Yeni ürün ekle
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Gerekli alanları kontrol et
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Ürün adı gereklidir' },
        { status: 400 }
      )
    }

    // Slug oluştur veya gelen slug'ı kullan
    const slug = body.slug || await generateUniqueSlug(body.name)

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug: slug,
        description: body.description?.trim() || '',
        sku: body.sku?.trim() || '',
        partNumber: body.partNumber?.trim() || '',
        oemNumber: body.oemNumber?.trim() || '',
        stock: parseInt(body.stock?.toString() || '0'),
        specifications: body.specifications || {},
        images: body.images || [],
        category: body.categoryId ? {
          connect: { id: body.categoryId }
        } : undefined,
        brand: body.brandId ? {
          connect: { id: body.brandId }
        } : undefined
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün eklenirken hata:', error)

    // Prisma hataları için özel mesajlar
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Bu ürün zaten mevcut' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Ürün eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 