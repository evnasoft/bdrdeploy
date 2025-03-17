'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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
  category: Category | null
  brand: Brand | null
  slug: string
  images: string[] | null
}

interface FilterState {
  category: string | null
  brand: string | null
  inStock: boolean
  search: string
  sortBy: 'name' | 'stock' | 'newest'
  page: number
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category'),
    brand: searchParams.get('brand'),
    inStock: searchParams.get('inStock') === 'true',
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'newest',
    page: Number(searchParams.get('page')) || 1
  })

  const ITEMS_PER_PAGE = 50

  useEffect(() => {
    fetchFilters()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ])

      if (!categoriesRes.ok || !brandsRes.ok) {
        throw new Error('Filtreler yüklenirken hata oluştu')
      }

      const categoriesData = await categoriesRes.json()
      const brandsData = await brandsRes.json()

      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData)
      } else if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
        setCategories(categoriesData.categories)
      } else {
        console.error('Kategoriler dizisi bulunamadı:', categoriesData)
        setCategories([])
      }

      if (Array.isArray(brandsData)) {
        setBrands(brandsData)
      } else if (brandsData.brands && Array.isArray(brandsData.brands)) {
        setBrands(brandsData.brands)
      } else {
        console.error('Markalar dizisi bulunamadı:', brandsData)
        setBrands([])
      }
    } catch (error) {
      console.error('Filtreler yüklenirken hata:', error)
      setCategories([])
      setBrands([])
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        ...(filters.category && { category: filters.category }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.inStock && { inStock: 'true' }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        page: filters.page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })

      console.log('API isteği yapılıyor:', `/api/products?${queryParams}`)
      const response = await fetch(`/api/products?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API yanıtı:', data)

      if (!data || typeof data !== 'object') {
        console.error('Geçersiz API yanıtı:', data)
        setProducts([])
        setTotalProducts(0)
        return
      }

      if (!Array.isArray(data.products)) {
        console.error('Ürünler dizisi bulunamadı:', data)
        setProducts([])
        setTotalProducts(0)
        return
      }

      setProducts(data.products)
      setTotalProducts(data.total || 0)
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
      setProducts([])
      setTotalProducts(0)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: key !== 'page' ? 1 : value
    }))
    
    const newParams = new URLSearchParams(searchParams.toString())
    if (value || value === 0) {
      newParams.set(key, value.toString())
    } else {
      newParams.delete(key)
    }
    
    if (key !== 'page') {
      newParams.set('page', '1')
    }
    
    router.push(`/products?${newParams.toString()}`)
  }

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Üst Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Kataloğu</h1>
        <p className="text-gray-600">
          Toplam {totalProducts} ürün bulundu
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtreler */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
            {/* Arama */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Ara
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Ürün adı veya kodu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Kategoriler */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriler
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      checked={filters.category === category.id}
                      onChange={() => handleFilterChange('category', category.id)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
              {filters.category && (
                <button
                  onClick={() => handleFilterChange('category', null)}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Kategori Filtresini Temizle
                </button>
              )}
            </div>

            {/* Markalar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Markalar
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center">
                    <input
                      type="radio"
                      checked={filters.brand === brand.id}
                      onChange={() => handleFilterChange('brand', brand.id)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{brand.name}</span>
                  </label>
                ))}
              </div>
              {filters.brand && (
                <button
                  onClick={() => handleFilterChange('brand', null)}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Marka Filtresini Temizle
                </button>
              )}
            </div>

            {/* Stok Durumu */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4 rounded"
                />
                <span className="ml-2 text-gray-700">Sadece Stokta Olanlar</span>
              </label>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">En Yeniler</option>
                <option value="name">İsme Göre (A-Z)</option>
                <option value="stock">Stok Miktarına Göre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ürün Listesi */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-3 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group p-4 block"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">
                        {product.sku}
                      </span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {product.category?.name}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[40px] group-hover:text-blue-600">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[32px]">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.stock > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {product.stock > 0 ? 'Stokta' : 'Stokta Yok'}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        Detayları Gör →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                    <button
                      onClick={() => handleFilterChange('page', filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Önceki
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      // Sayfa sayısı 7'den fazlaysa, aktif sayfanın etrafındaki 3 sayfayı göster
                      if (totalPages > 7) {
                        const currentPage = filters.page;
                        const pageNumber = i + 1;
                        
                        // Her zaman ilk ve son sayfayı göster
                        if (pageNumber === 1 || pageNumber === totalPages) {
                          return (
                            <button
                              key={i}
                              onClick={() => handleFilterChange('page', pageNumber)}
                              className={`px-3 py-1 border rounded-lg ${
                                filters.page === pageNumber
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
                        // Aktif sayfanın etrafındaki 3 sayfayı göster
                        if (
                          pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1
                        ) {
                          return (
                            <button
                              key={i}
                              onClick={() => handleFilterChange('page', pageNumber)}
                              className={`px-3 py-1 border rounded-lg ${
                                filters.page === pageNumber
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        
                        // Boşlukları "..." ile göster
                        if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={i}
                              className="px-2 py-1 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      }
                      
                      // Sayfa sayısı 7 veya daha azsa hepsini göster
                      return (
                        <button
                          key={i}
                          onClick={() => handleFilterChange('page', i + 1)}
                          className={`px-3 py-1 border rounded-lg ${
                            filters.page === i + 1
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handleFilterChange('page', filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 