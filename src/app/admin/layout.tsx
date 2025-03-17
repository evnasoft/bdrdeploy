'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaTachometerAlt, 
  FaBox, 
  FaLayerGroup, 
  FaTrademark, 
  FaTruck,
  FaCog,
  FaBars,
  FaTimes
} from 'react-icons/fa'

const menuItems = [
  { 
    title: 'Dashboard', 
    href: '/admin', 
    icon: FaTachometerAlt 
  },
  { 
    title: 'Ürünler', 
    href: '/admin/products', 
    icon: FaBox 
  },
  { 
    title: 'Kategoriler', 
    href: '/admin/categories', 
    icon: FaLayerGroup 
  },
  { 
    title: 'Markalar', 
    href: '/admin/brands', 
    icon: FaTrademark 
  },
  { 
    title: 'Makine Modelleri', 
    href: '/admin/models', 
    icon: FaTruck 
  },
  { 
    title: 'Ayarlar', 
    href: '/admin/settings', 
    icon: FaCog 
  }
]

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobil Menü Butonu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:bg-gray-50"
        >
          {sidebarOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-600">
            <Link href="/admin" className="text-white text-xl font-bold">
              Admin Panel
            </Link>
          </div>

          {/* Menü */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-blue-700' : 'text-gray-400'
                  }`} />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Alt Bilgi */}
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500">
              © 2024 Admin Panel
            </p>
          </div>
        </div>
      </aside>

      {/* Ana İçerik */}
      <main className={`lg:ml-64 min-h-screen transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </main>
    </div>
  )
} 