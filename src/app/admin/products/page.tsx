'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

type Product = {
  id: string
  name: string
  sku: string
  stock: number
  images: string[]
  category?: {
    name: string
  }
  brand?: {
    name: string
  }
}

type Pagination = {
  total: number
  pages: number
  currentPage: number
  perPage: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    inStock: false
  })
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 50
  })

  useEffect(() => {
    fetchProducts(1) // Filtreler değiştiğinde ilk sayfaya dön
  }, [search, filters])

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        search,
        ...(filters.category && { category: filters.category }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.inStock && { inStock: 'true' })
      })

      const response = await fetch(`/api/admin/products?${queryParams}`)
      if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu')
      
      const data = await response.json()
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Ürün silinirken bir hata oluştu')
      
      // Ürünü listeden kaldır
      setProducts(products.filter(product => product.id !== id))
    } catch (error) {
      console.error('Ürün silinirken hata:', error)
      alert('Ürün silinirken bir hata oluştu')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Yeni Ürün
        </Link>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tüm Kategoriler</option>
          </select>
          <select
            value={filters.brand}
            onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tüm Markalar</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Sadece Stokta Olanlar</span>
          </label>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marka
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Ürün bulunamadı
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                            <Image
                              src={(product.images && product.images.length > 0) ? product.images[0] : '/images/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.brand?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        {!loading && products.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Toplam <span className="font-medium">{pagination.total}</span> ürün
              {pagination.total > pagination.perPage && (
                <span> (Sayfa {pagination.currentPage}/{pagination.pages})</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchProducts(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                  pagination.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                <FaChevronLeft className="w-4 h-4 mr-1" />
                Önceki
              </button>
              <button
                onClick={() => fetchProducts(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.pages}
                className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                  pagination.currentPage === pagination.pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                Sonraki
                <FaChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 