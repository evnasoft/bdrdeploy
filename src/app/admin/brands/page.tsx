'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

type Brand = {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [newBrandName, setNewBrandName] = useState('')
  const [editBrandName, setEditBrandName] = useState('')

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands')
      if (!response.ok) throw new Error('Markalar yüklenirken bir hata oluştu')
      const data = await response.json()
      setBrands(data.brands)
    } catch (error) {
      console.error('Markalar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return

    try {
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newBrandName })
      })

      if (!response.ok) throw new Error('Marka eklenirken bir hata oluştu')
      
      setNewBrandName('')
      setShowAddModal(false)
      fetchBrands()
    } catch (error) {
      console.error('Marka eklenirken hata:', error)
      alert('Marka eklenirken bir hata oluştu')
    }
  }

  const handleEditBrand = async () => {
    if (!selectedBrand || !editBrandName.trim()) return

    try {
      const response = await fetch(`/api/admin/brands/${selectedBrand.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editBrandName })
      })

      if (!response.ok) throw new Error('Marka güncellenirken bir hata oluştu')
      
      setShowEditModal(false)
      setSelectedBrand(null)
      setEditBrandName('')
      fetchBrands()
    } catch (error) {
      console.error('Marka güncellenirken hata:', error)
      alert('Marka güncellenirken bir hata oluştu')
    }
  }

  const handleDeleteBrand = async (brand: Brand) => {
    if (!confirm(`"${brand.name}" markasını silmek istediğinize emin misiniz?`)) return

    try {
      const response = await fetch(`/api/admin/brands/${brand.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Marka silinirken bir hata oluştu')
      
      fetchBrands()
    } catch (error) {
      console.error('Marka silinirken hata:', error)
      alert('Marka silinirken bir hata oluştu')
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Markalar
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Yeni Marka
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marka Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturulma Tarihi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {brand.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {brand.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(brand.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedBrand(brand)
                      setEditBrandName(brand.name)
                      setShowEditModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yeni Marka Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Yeni Marka Ekle
            </h2>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Marka adı"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                İptal
              </button>
              <button
                onClick={handleAddBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marka Düzenleme Modalı */}
      {showEditModal && selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Marka Düzenle
            </h2>
            <input
              type="text"
              value={editBrandName}
              onChange={(e) => setEditBrandName(e.target.value)}
              placeholder="Marka adı"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedBrand(null)
                  setEditBrandName('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                İptal
              </button>
              <button
                onClick={handleEditBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 