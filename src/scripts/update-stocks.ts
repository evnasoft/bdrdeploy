import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateAllProductStocks() {
  try {
    console.log('Tüm ürünlerin stokları güncelleniyor...')
    
    const result = await prisma.product.updateMany({
      data: {
        stock: 100 // Tüm ürünlerin stokunu 100 olarak ayarlıyoruz
      }
    })

    console.log(`Başarıyla güncellenen ürün sayısı: ${result.count}`)
  } catch (error) {
    console.error('Stok güncellenirken hata oluştu:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAllProductStocks() 