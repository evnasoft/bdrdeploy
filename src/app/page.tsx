'use client'

import Link from 'next/link'
import Image from 'next/image'
import ProductGrid from '@/components/ProductGrid'
import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  logo: string | null
}

interface Product {
  id: string
  name: string
  description: string | null
  stock: number
  sku: string
  images: string[]
  category: Category | null
  brand: Brand | null
}

async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    take: 8,
  })
  return products
}

async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}

async function getBrands(): Promise<Brand[]> {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return brands
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/products?featured=true&limit=8')
        const data = await response.json()
        
        if (Array.isArray(data.products)) {
          setProducts(data.products)
        }

        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands')
        ])

        const categoriesData = await categoriesRes.json()
        const brandsData = await brandsRes.json()

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData)
        }
        if (Array.isArray(brandsData)) {
          setBrands(brandsData)
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20">
        {/* Arka plan resmi */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 z-10" />
          <div className="absolute inset-0 bg-[url('/images/hero-construction.jpg')] bg-cover bg-center bg-fixed" />
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                Profesyonel İş Makinası
                <span className="text-yellow-400 block mt-2">Yedek Parça Çözümleri</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                20 yılı aşkın tecrübemizle, dünyanın önde gelen markalarının orijinal yedek parçalarını
                güvenilir ve hızlı bir şekilde temin ediyoruz.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 inline-flex items-center group"
                >
                  Ürünleri İncele
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 inline-block"
                >
                  Bize Ulaşın
                </Link>
              </div>
            </div>
            <div className="relative h-[600px] hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-[300px] transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/3.png"
                    alt="İş Makinası 1"
                    fill
                    className="object-contain animate-float"
                    priority
                    unoptimized
                  />
                </div>
                <div className="relative h-[300px] transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/2.png"
                    alt="İş Makinası 2"
                    fill
                    className="object-contain animate-float delay-200"
                    priority
                    unoptimized
                  />
                </div>
                <div className="relative h-[300px] col-span-2 mt-4 transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/1.png"
                    alt="İş Makinası 3"
                    fill
                    className="object-contain animate-float delay-400"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-600">Yıllık Tecrübe</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">Ürün Çeşidi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Teknik Destek</div>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4" style={{color:'black'}}>Neden Bizi Tercih Etmelisiniz?</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto" >
            İş makinası yedek parça tedariğinde güvenilir çözüm ortağınız olarak, size en iyi hizmeti sunuyoruz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center" style={{color:'black'}}>Orijinal Ürün Garantisi</h3>
              <p className="text-gray-600 text-center">
                Tüm ürünlerimiz orijinal olup, uluslararası kalite standartlarına uygunluk belgesine sahiptir.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center"style={{color:'black'}}>Hızlı Teslimat</h3>
              <p className="text-gray-600 text-center">
                Geniş stok ağımız sayesinde siparişleriniz aynı gün içinde kargoya verilir.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center"style={{color:'black'}}>Uzman Teknik Destek</h3>
              <p className="text-gray-600 text-center">
                Deneyimli ekibimiz 7/24 teknik destek ve danışmanlık hizmeti vermektedir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ürünler */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En çok tercih edilen ve stokta bulunan ürünlerimizi inceleyin
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} categories={categories} />
          )}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              Tüm Ürünleri İncele
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Markalar */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Çalıştığımız Markalar
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Dünya'nın önde gelen iş makinası üreticilerinin yetkili yedek parça tedarikçisiyiz.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative w-full h-12">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-900">{brand.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
