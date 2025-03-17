'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import * as XLSX from 'xlsx'

// Türkçe karakterleri değiştiren fonksiyon
const turkishToEnglish = (text: string): string => {
  const charMap: { [key: string]: string } = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C'
  }
  return text.replace(/[ıİğĞüÜşŞöÖçÇ]/g, char => charMap[char] || char)
}

// Slug oluşturan fonksiyon
const createSlug = (text: string): string => {
  return turkishToEnglish(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire bırak
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Birden fazla tireyi tek tireye dönüştür
}

// Ürünleri gruplar halinde ekleyen fonksiyon
const addProductsInBatches = async (products: string[], batchSize: number = 50) => {
  const errors: string[] = []
  const batches = []
  
  // Ürünleri gruplara böl
  for (let i = 0; i < products.length; i += batchSize) {
    batches.push(products.slice(i, i + batchSize))
  }

  // Her grubu sırayla işle
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    try {
      // Gruptaki her ürünü ekle
      const promises = batch.map(productName => 
        fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: productName,
            slug: createSlug(productName),
            sku: '',
            stock: 0,
            categoryId: '',
            brandId: '',
          }),
        }).then(async (response) => {
          if (!response.ok) {
            const error = await response.json()
            throw new Error(`${productName}: ${error.error || 'Bir hata oluştu'}`)
          }
          return response.json()
        })
      )

      await Promise.all(promises)
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message)
      } else {
        errors.push('Bilinmeyen bir hata oluştu')
      }
    }

    // Her grup arasında kısa bir bekleme süresi
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return errors
}

export default function BulkImportPage() {
  const router = useRouter()
  const [products, setProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [excelText, setExcelText] = useState('')
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '')
    setProducts(lines)
    setExcelText(e.target.value)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][]

        // İlk sütundaki ürün isimlerini al ve boş satırları filtrele
        const productNames = jsonData
          .map(row => row[0])
          .filter(name => name && typeof name === 'string' && name.trim() !== '')

        setProducts(productNames)
        setExcelText(productNames.join('\n'))
      } catch (error) {
        console.error('Excel dosyası okunurken hata:', error)
        alert('Excel dosyası okunurken bir hata oluştu')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setProgress(0)

    try {
      const errors = await addProductsInBatches(products)
      
      if (errors.length > 0) {
        setErrors(errors)
        alert('Bazı ürünler eklenirken hata oluştu. Detaylar için hata listesini kontrol edin.')
      } else {
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Ürünler eklenirken hata:', error)
      alert('Ürünler eklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
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
            Toplu Ürün Ekle
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Excel Yükleme */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Excel Dosyası Yükle
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Excel dosyanızın ilk sütununda ürün isimleri olmalıdır.
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Ürün İsimleri
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Her satıra bir ürün adı yazın veya Excel'den kopyalayıp yapıştırın.
            </p>
            <textarea
              rows={10}
              value={excelText}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Örnek:
Ürün 1
Ürün 2
Ürün 3"
              onChange={handleTextChange}
            />
          </div>

          {/* Hata Listesi */}
          {errors.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-red-600 mb-2">
                Hata Oluşan Ürünler:
              </h3>
              <div className="max-h-40 overflow-y-auto bg-red-50 rounded-lg p-3">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 mb-1">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {products.length} ürün eklenecek
            </div>
            <button
              type="submit"
              disabled={loading || products.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Ekleniyor...' : 'Ürünleri Ekle'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 