'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa'

type Product = {
  id: string
  name: string
  description: string
  sku: string
  partNumber: string
  oemNumber: string
  stock: number
  specifications: Record<string, any>
  images: string[]
  categoryId?: string
  brandId?: string
  category?: {
    id: string
    name: string
  }
  brand?: {
    id: string
    name: string
  }
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    fetchProduct()
    fetchCategories()
    fetchBrands()
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${resolvedParams.id}`)
      if (!response.ok) throw new Error('Ürün yüklenirken bir hata oluştu')
      const data = await response.json()
      // Null değerleri boş stringe çevir
      const sanitizedData = {
        ...data,
        name: data.name || '',
        description: data.description || '',
        sku: data.sku || '',
        partNumber: data.partNumber || '',
        oemNumber: data.oemNumber || '',
        stock: data.stock || 0,
        specifications: data.specifications || {},
        images: data.images || [],
        categoryId: data.categoryId || '',
        brandId: data.brandId || ''
      }
      setProduct(sanitizedData)
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (!response.ok) throw new Error('Kategoriler yüklenirken bir hata oluştu')
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands')
      if (!response.ok) throw new Error('Markalar yüklenirken bir hata oluştu')
      const data = await response.json()
      setBrands(data.brands)
    } catch (error) {
      console.error('Markalar yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/products/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...product,
          stock: Number(product.stock) // Stok değerini sayıya çevir
        })
      })

      if (!response.ok) throw new Error('Ürün güncellenirken bir hata oluştu')
      
      router.push('/admin/products')
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error)
      alert('Ürün güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Ürün bulunamadı
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-gray-900 hover:text-black"
          >
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Ürün Düzenle
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Ürün Adı
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={product.sku}
                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Parça Numarası
              </label>
              <input
                type="text"
                value={product.partNumber}
                onChange={(e) => setProduct({ ...product, partNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                OEM Numarası
              </label>
              <input
                type="text"
                value={product.oemNumber}
                onChange={(e) => setProduct({ ...product, oemNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Stok
              </label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Kategori
              </label>
              <select
                value={product.categoryId || ''}
                onChange={(e) => setProduct({ ...product, categoryId: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Marka
              </label>
              <select
                value={product.brandId || ''}
                onChange={(e) => setProduct({ ...product, brandId: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">Marka Seçin</option>
                {brands.map((brand: any) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Açıklama
            </label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white hover:bg-gray-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Kaydediliyor...
              </div>
            ) : (
              <>
                <FaSave className="w-4 h-4 mr-2" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 