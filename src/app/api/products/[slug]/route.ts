import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Tekil ürün getir
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün getirme hatası:', error)
    return NextResponse.json(
      { error: 'Ürün getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Ürün güncelle
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()

    const product = await prisma.product.update({
      where: { slug: params.slug },
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        partNumber: body.partNumber,
        oemNumber: body.oemNumber,
        price: parseFloat(body.price),
        stock: parseInt(body.stock),
        specifications: body.specifications || {},
        categoryId: body.categoryId,
        brandId: body.brandId,
        images: body.images || []
      },
      include: {
        category: true,
        brand: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Ürün sil
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.product.delete({
      where: { slug: params.slug }
    })

    return NextResponse.json(
      { message: 'Ürün başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ürün silme hatası:', error)
    return NextResponse.json(
      { error: 'Ürün silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 