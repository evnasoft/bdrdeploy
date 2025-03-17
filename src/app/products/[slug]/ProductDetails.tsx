'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaTruck, FaCheck, FaWhatsapp, FaPhone, FaEnvelope, FaArrowRight } from 'react-icons/fa'

type MachineModel = {
  id: string
  name: string
  year: number | null
  type: string
  brand: {
    id: string
    name: string
    slug: string
  }
}

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  sku: string
  partNumber: string | null
  oemNumber: string | null
  price: number | null
  stock: number
  specifications: any
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  } | null
  brand: {
    id: string
    name: string
    slug: string
  } | null
}

export default function ProductDetails({ slug }: { slug: string }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${slug}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Ürün yüklenirken bir hata oluştu')
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Ürün bulunamadı</div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Üst Navigasyon */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">
              Ürünler
            </Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/categories/${product.category.slug}`} className="hover:text-blue-600">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sol Kolon - Görsel Galerisi */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
              <Image
                src={(product.images && product.images.length > 0) ? product.images[selectedImage] : '/images/product-placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Görsel ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Kolon - Ürün Bilgileri */}
          <div>
            <div className="mb-6">
              {product.brand && (
                <Link
                  href={`/brands/${product.brand.slug}`}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  {product.brand.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">SKU: {product.sku}</span>
                {product.partNumber && (
                  <span className="text-gray-500">Parça No: {product.partNumber}</span>
                )}
                {product.oemNumber && (
                  <span className="text-gray-500">OEM No: {product.oemNumber}</span>
                )}
              </div>
            </div>

            {/* Stok Durumu */}
            <div className="flex items-center gap-2 mb-8">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className={product.stock > 0 ? 'text-green-700' : 'text-red-700'}>
                {product.stock > 0 ? 'Stokta Mevcut' : 'Stokta Yok'}
              </span>
            </div>

            {/* Özellikler */}
            <div className="prose prose-blue max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Avantajlar */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ürün Avantajları
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <FaTruck className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-gray-600">Hızlı kargo</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <FaCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-gray-600">Güvenli alışveriş</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <FaCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-gray-600">7/24 hizmet</span>
                </div>
              </div>
            </div>

            {/* İletişim Butonları */}
            <div className="space-y-4">
              <a
                href={`https://wa.me/905432563717?text=Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                WhatsApp ile Bilgi Al
              </a>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="tel:+905432563717"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <FaPhone className="w-4 h-4" />
                  Ara
                </a>
                <a
                  href="mailto:info@bdrspareparts.com"
                  className="flex items-center justify-center gap-2 bg-yellow-600 text-white py-3 px-6 rounded-xl hover:bg-yellow-700 transition-colors"
                >
                  <FaEnvelope className="w-4 h-4" />
                  E-posta
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Teknik Özellikler */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Teknik Özellikler
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div
                    key={key}
                    className={`flex items-center p-4 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <span className="font-medium text-gray-900 w-1/3">{key}</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 