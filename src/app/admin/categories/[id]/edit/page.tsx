'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  description: string | null
  parentId: string | null
}

export default function EditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    description: '',
    parentId: null,
  })

  useEffect(() => {
    fetchCategories()
    fetchCategory()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.categories.filter((c: Category) => c.id !== params.id))
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${params.id}`)
      const data = await response.json()
      setFormData(data)
    } catch (error) {
      console.error('Kategori yüklenirken hata:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/categories')
      } else {
        const error = await response.json()
        alert(error.message || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Kategori güncellenirken hata:', error)
      alert('Kategori güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Kategori Düzenle</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori Adı
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Kategori adını girin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Üst Kategori
            </label>
            <select
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Ana Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              rows={4}
              placeholder="Kategori açıklamasını girin"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
} 