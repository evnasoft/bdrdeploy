import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Kategori alınırken hata:', error)
    return NextResponse.json(
      { error: 'Kategori alınırken bir hata oluştu' },
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

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-')
      }
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Kategori silinirken hata:', error)
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 