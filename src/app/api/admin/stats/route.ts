import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Tüm istatistikleri paralel olarak getir
    const [
      products,
      categories,
      brands,
      models
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.machineModel.count()
    ])

    return NextResponse.json({
      products,
      categories,
      brands,
      models
    })
  } catch (error) {
    console.error('İstatistikler alınırken hata:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 