import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function importDatabase() {
  try {
    console.log('Veritabanı içe aktarılıyor...')

    // JSON dosyasını oku
    const data = JSON.parse(fs.readFileSync('database-export.json', 'utf-8'))

    // Veritabanını temizle
    await prisma.$transaction([
      prisma.settings.deleteMany(),
      prisma.user.deleteMany(),
      prisma.product.deleteMany(),
      prisma.machineModel.deleteMany(),
      prisma.brand.deleteMany(),
      prisma.category.deleteMany(),
    ])

    // Verileri sırayla ekle
    for (const category of data.categories) {
      await prisma.category.create({ data: category })
    }

    for (const brand of data.brands) {
      await prisma.brand.create({ data: brand })
    }

    for (const model of data.machineModels) {
      await prisma.machineModel.create({ data: model })
    }

    for (const product of data.products) {
      await prisma.product.create({ data: product })
    }

    for (const user of data.users) {
      await prisma.user.create({ data: user })
    }

    for (const setting of data.settings) {
      await prisma.settings.create({ data: setting })
    }

    console.log('Veritabanı başarıyla içe aktarıldı!')
  } catch (error) {
    console.error('İçe aktarma hatası:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importDatabase() 