import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: params.id }
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Marka bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Marka alınırken hata:', error)
    return NextResponse.json(
      { error: 'Marka alınırken bir hata oluştu' },
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
    const { name } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Marka adı gereklidir' },
        { status: 400 }
      )
    }

    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      }
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Marka güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Marka güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const brand = await prisma.brand.delete({
      where: { id: params.id }
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Marka silinirken hata:', error)
    return NextResponse.json(
      { error: 'Marka silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 