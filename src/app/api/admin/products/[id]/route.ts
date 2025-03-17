import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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
    console.error('Ürün alınırken hata:', error)
    return NextResponse.json(
      { error: 'Ürün alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('Gelen veri:', body) // Debug için log

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        sku: body.sku,
        partNumber: body.partNumber,
        oemNumber: body.oemNumber,
        stock: parseInt(body.stock.toString()), // String olarak gelse bile sayıya çevir
        specifications: body.specifications || {},
        images: body.images || [],
        category: body.categoryId ? {
          connect: { id: body.categoryId }
        } : { disconnect: true },
        brand: body.brandId ? {
          connect: { id: body.brandId }
        } : { disconnect: true }
      }
    })

    console.log('Güncellenen ürün:', product) // Debug için log
    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün silinirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 