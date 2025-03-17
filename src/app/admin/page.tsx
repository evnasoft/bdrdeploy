'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBox, FaLayerGroup, FaTrademark, FaTruck, FaPlus, FaFileExcel, FaDollarSign } from 'react-icons/fa'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    models: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-8">Yönetim Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Toplam Ürün</h2>
            <FaBox className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.products}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Kategoriler</h2>
            <FaLayerGroup className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.categories}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Markalar</h2>
            <FaTrademark className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.brands}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Makine Modelleri</h2>
            <FaTruck className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.models}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/admin/products/new"
            className="flex items-center justify-center gap-3 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-5 h-5" />
            Yeni Ürün Ekle
          </Link>
          <Link 
            href="/admin/products/bulk-import"
            className="flex items-center justify-center gap-3 bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors"
          >
            <FaFileExcel className="w-5 h-5" />
            Excel ile Toplu Ürün Ekle
          </Link>
          <Link 
            href="/admin/products/prices"
            className="flex items-center justify-center gap-3 bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <FaDollarSign className="w-5 h-5" />
            Fiyatları Güncelle
          </Link>
        </div>
      </div>

      {/* Son İşlemler */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Son İşlemler</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detay
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date().toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Yeni ürün eklendi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    <Link href="/admin/products/1">Görüntüle</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 