import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-lg font-semibold mb-4">Hakkımızda</h4>
            <p className="text-gray-400">
              İş makinesi yedek parçaları konusunda uzman kadromuzla
              hizmetinizdeyiz.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gray-400 hover:text-white">
                  Markalar
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Telefon: +90 543 256 37 17</li>
              <li>Email: info@bdrspareparts.com</li>
              <li>Adres: ivedik osb. 1479. sokak no:7 Yenimahalle/Ankara</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Bizi Takip Edin</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 