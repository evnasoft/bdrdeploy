import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

// Tüm ürünleri getir
export async function GET(request: Request) {
  try {
    console.log('API: Ürünler getiriliyor...')
    
    // URL parametrelerini al
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const inStock = searchParams.get('inStock') === 'true'
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    console.log('API: Arama parametreleri:', {
      search,
      category,
      brand,
      inStock,
      sortBy,
      page,
      limit
    })

    // Veritabanı bağlantısını kontrol et
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('API: Veritabanı bağlantısı başarılı')
    } catch (dbError) {
      console.error('API: Veritabanı bağlantı hatası:', dbError)
      return NextResponse.json(
        { error: 'Veritabanı bağlantısı kurulamadı' },
        { status: 500 }
      )
    }

    // Filtreleme koşullarını oluştur
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      AND: [
        // Arama filtresi (ad veya SKU'da)
        search ? {
          OR: [
            { name: { contains: search } },
            { sku: { contains: search } },
            { description: { contains: search } }
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

    // Sıralama seçenekleri
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      ...(sortBy === 'name' && { name: 'asc' }),
      ...(sortBy === 'stock' && { stock: 'desc' }),
      ...(sortBy === 'newest' && { createdAt: 'desc' })
    }

    // Toplam ürün sayısını al
    const total = await prisma.product.count({ where })
    console.log('API: Toplam ürün sayısı:', total)

    // Ürünleri getir
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    })

    console.log('API: Bulunan ürün sayısı:', products.length)
    
    if (products.length > 0) {
      console.log('API: İlk ürün örneği:', JSON.stringify({
        id: products[0].id,
        name: products[0].name,
        slug: products[0].slug
      }))
    }

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('API: Genel hata:', error)
    return NextResponse.json(
      { error: 'Ürünler getirilirken bir hata oluştu', details: String(error) },
      { status: 500 }
    )
  }
}

// Yeni ürün ekle
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        sku: body.sku,
        partNumber: body.partNumber,
        oemNumber: body.oemNumber,
        price: parseFloat(body.price),
        stock: parseInt(body.stock),
        specifications: body.specifications || {},
        category: {
          connect: { id: body.categoryId }
        },
        brand: {
          connect: { id: body.brandId }
        }
      },
      include: {
        category: true,
        brand: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 