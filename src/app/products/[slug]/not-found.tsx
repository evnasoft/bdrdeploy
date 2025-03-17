import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ürün Bulunamadı
        </h2>
        <p className="text-gray-600 mb-8">
          Aradığınız ürün bulunamadı veya kaldırılmış olabilir.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Ürün Listesine Dön
        </Link>
      </div>
    </div>
  )
} 