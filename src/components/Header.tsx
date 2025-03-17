import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.jpg"
              alt="BDR Spare Parts"
              width={150}
              height={60}
              className="h-12 w-auto"
            />
          </Link>

          {/* Ana Menü */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Ürünler
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              İletişim
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 