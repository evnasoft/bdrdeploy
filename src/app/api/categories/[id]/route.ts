import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Tekil kategori getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Kategori getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Kategori getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Kategori güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const category = await prisma.category.update({
      where: { id: params.id },
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
    console.error('Kategori güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Kategori güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Kategori sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Önce kategoriye ait ürün sayısını kontrol et
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    // Eğer kategoriye ait ürün varsa silme işlemini engelle
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error: 'Bu kategoriye ait ürünler bulunmaktadır. Önce ürünleri başka bir kategoriye taşıyın.',
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kategori silinirken hata:', error)
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 