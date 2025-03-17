import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import slugify from 'slugify'

const categories = [
  'Motor Parçaları',
  'Hidrolik Sistem',
  'Şanzıman',
  'Filtreler',
  'Elektrik Sistemi',
  'Yürüyüş Takımı',
  'Kabin Parçaları',
  'Kova ve Ataşmanlar'
]

const brands = [
  { 
    name: 'Caterpillar',
    models: [
      { name: '320D', type: 'Ekskavatör' },
      { name: '330D', type: 'Ekskavatör' },
      { name: 'D6R', type: 'Dozer' },
      { name: '950H', type: 'Yükleyici' }
    ]
  },
  {
    name: 'Komatsu',
    models: [
      { name: 'PC200', type: 'Ekskavatör' },
      { name: 'PC300', type: 'Ekskavatör' },
      { name: 'D65', type: 'Dozer' },
      { name: 'WA380', type: 'Yükleyici' }
    ]
  },
  {
    name: 'Volvo',
    models: [
      { name: 'EC210', type: 'Ekskavatör' },
      { name: 'EC240', type: 'Ekskavatör' },
      { name: 'L90', type: 'Yükleyici' },
      { name: 'A25D', type: 'Kamyon' }
    ]
  }
]

const parts = {
  'Motor Parçaları': ['Piston', 'Gömlek', 'Subap', 'Krank'],
  'Hidrolik Sistem': ['Pompa', 'Valf', 'Silindir', 'Hortum'],
  'Şanzıman': ['Dişli', 'Kavrama', 'Mil', 'Rulman'],
  'Filtreler': ['Yağ Filtresi', 'Yakıt Filtresi', 'Hava Filtresi'],
  'Elektrik Sistemi': ['Marş Motoru', 'Alternatör', 'Akü', 'Sensör'],
  'Yürüyüş Takımı': ['Palet', 'Makara', 'Gergi', 'Zincir'],
  'Kabin Parçaları': ['Cam', 'Kapı', 'Koltuk', 'Klima'],
  'Kova ve Ataşmanlar': ['Kova', 'Tırnak', 'Bıçak', 'Adaptör']
}

export async function POST() {
  try {
    console.log('Seed işlemi başlıyor...')
    
    // Mevcut verileri temizle
    console.log('Mevcut veriler temizleniyor...')
    await prisma.product.deleteMany()
    await prisma.machineModel.deleteMany()
    await prisma.category.deleteMany()
    await prisma.brand.deleteMany()
    console.log('Mevcut veriler temizlendi')

    // Kategorileri ekle
    console.log('Kategoriler ekleniyor...')
    const createdCategories = await prisma.category.createMany({
      data: categories.map(category => ({
        name: category,
        slug: slugify(category, { lower: true, strict: true })
      }))
    })
    console.log(`${createdCategories.count} kategori eklendi`)

    // Markaları ekle
    console.log('Markalar ekleniyor...')
    const createdBrands = await prisma.brand.createMany({
      data: brands.map(brand => ({
        name: brand.name,
        slug: slugify(brand.name, { lower: true, strict: true })
      }))
    })
    console.log(`${createdBrands.count} marka eklendi`)

    const dbCategories = await prisma.category.findMany()
    const dbBrands = await prisma.brand.findMany()

    // Modelleri ekle
    console.log('Modeller ekleniyor...')
    for (const brand of brands) {
      const dbBrand = dbBrands.find(b => b.name === brand.name)
      if (!dbBrand) {
        console.log(`${brand.name} markası bulunamadı`)
        continue
      }

      await prisma.machineModel.createMany({
        data: brand.models.map(model => ({
          name: model.name,
          type: model.type,
          brandId: dbBrand.id
        }))
      })
    }
    console.log('Modeller eklendi')

    // Modelleri getir
    const dbModels = await prisma.machineModel.findMany()
    console.log(`${dbModels.length} model bulundu`)

    // Ürünleri oluştur
    console.log('Ürünler oluşturuluyor...')
    let productCount = 0
    for (const brand of brands) {
      const dbBrand = dbBrands.find(b => b.name === brand.name)
      if (!dbBrand) {
        console.log(`${brand.name} markası bulunamadı`)
        continue
      }

      for (const model of brand.models) {
        const dbModel = dbModels.find(m => m.name === model.name && m.brandId === dbBrand.id)
        if (!dbModel) {
          console.log(`${brand.name} ${model.name} modeli bulunamadı`)
          continue
        }

        for (const category of categories) {
          const dbCategory = dbCategories.find(c => c.name === category)
          if (!dbCategory) {
            console.log(`${category} kategorisi bulunamadı`)
            continue
          }

          const partList = parts[category as keyof typeof parts]
          if (!partList) {
            console.log(`${category} kategorisi için parça listesi bulunamadı`)
            continue
          }

          for (const part of partList) {
            try {
              const name = `${brand.name} ${model.name} ${part}`
              const sku = `${brand.name.substring(0, 3).toUpperCase()}-${model.name}-${part.substring(0, 3).toUpperCase()}`
              const stock = Math.floor(Math.random() * 50)
              
              await prisma.product.create({
                data: {
                  name,
                  slug: slugify(name, { lower: true, strict: true }),
                  sku,
                  description: `${brand.name} ${model.name} için orijinal ${part.toLowerCase()}. Stok Kodu: ${sku}`,
                  stock,
                  categoryId: dbCategory.id,
                  brandId: dbBrand.id,
                  compatibleModels: {
                    connect: [{ id: dbModel.id }]
                  }
                }
              })
              productCount++
            } catch (error) {
              console.error('Ürün oluşturulurken hata:', error)
              console.error('Hatalı ürün bilgileri:', {
                name: `${brand.name} ${model.name} ${part}`,
                sku: `${brand.name.substring(0, 3).toUpperCase()}-${model.name}-${part.substring(0, 3).toUpperCase()}`,
                categoryId: dbCategory.id,
                brandId: dbBrand.id,
                modelId: dbModel.id
              })
            }
          }
        }
      }
    }
    console.log(`${productCount} ürün oluşturuldu`)

    const productsCount = await prisma.product.count()
    console.log(`Toplam ${productsCount} ürün bulunuyor`)

    return NextResponse.json({
      message: 'Demo veriler başarıyla eklendi',
      categoriesCount: createdCategories.count,
      brandsCount: createdBrands.count,
      productsCount
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Demo veriler eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 