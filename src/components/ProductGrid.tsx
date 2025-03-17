'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
}

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

export default function ProductGrid({ products = [], categories = [] }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.id === selectedCategory)
    : products

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-gray-600 max-w-2xl">
            En çok tercih edilen ve stokta bulunan ürünlerimizi inceleyin.
          </p>
        </div>
        {categories.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    category.id === selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center group whitespace-nowrap"
            >
              Tüm Ürünleri Gör
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">
                {product.sku}
              </span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {product.category?.name}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
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
            </div>
          </div>
        ))}
      </div>
    </>
  )
}