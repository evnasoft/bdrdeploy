import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function exportDatabase() {
  try {
    console.log('Veritabanı dışa aktarılıyor...')

    // Tüm tabloların verilerini al
    const categories = await prisma.category.findMany()
    const brands = await prisma.brand.findMany()
    const products = await prisma.product.findMany()
    const machineModels = await prisma.machineModel.findMany()
    const users = await prisma.user.findMany()
    const settings = await prisma.settings.findMany()

    // Verileri JSON dosyasına kaydet
    const exportData = {
      categories,
      brands,
      products,
      machineModels,
      users,
      settings
    }

    fs.writeFileSync(
      'database-export.json',
      JSON.stringify(exportData, null, 2)
    )

    console.log('Veritabanı başarıyla dışa aktarıldı: database-export.json')
  } catch (error) {
    console.error('Dışa aktarma hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportDatabase() 