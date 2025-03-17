import Image from 'next/image'
import Link from 'next/link'
import { FaHistory, FaEye, FaHandshake, FaTruck, FaTools, FaUsers, FaGlobe, FaCheck } from 'react-icons/fa'

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
           
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                20 Yıllık Tecrübe ve Güvenilirlik
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
                İş makineleri yedek parça sektöründe güvenilir çözüm ortağınız olarak, kaliteli hizmet sunmaya devam ediyoruz.
              </p>
              <div className="flex flex-wrap gap-4">
               
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FaCheck className="text-green-400" />
                  <span className="text-white">Hızlı Teslimat</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <FaCheck className="text-green-400" />
                  <span className="text-white">Teknik Destek</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-[500px] w-full">
                <Image
                  src="/images/logo2.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hikayemiz Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 rounded-2xl mb-6">
              <FaHistory className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Hikayemiz
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
1968 yılından bu yana sektörde inşaat ekipmanları için yenilikçi ve dayanıklı çözümler üretiyoruz. Dünya pazarındaki payımızı güçlendiriyor ve alternatifler sunuyoruz. Farklı model ve markalardaki sınıflandırıcılar için Ar-Ge çalışmaları yürütüyoruz. Yurt içi ve yurt dışı müşterilerimizin yanındayız. İnşaat makineleri için tamir, yedek parça, bakım, servis, makine ticareti ve servis hizmeti veriyoruz.            </p>
          </div>

        </div>
      </section>

      {/* Vizyon & Misyon Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 rounded-3xl transform rotate-3" />
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 rounded-xl flex items-center justify-center">
                    <FaEye className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Vizyonumuz
                  </h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  İş makineleri yedek parça sektöründe dünya standartlarında hizmet veren, yenilikçi çözümler üreten, müşteri memnuniyetini ön planda tutan ve sürdürülebilir büyümeyi hedefleyen lider firma olmak.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 rounded-3xl transform -rotate-3" />
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 rounded-xl flex items-center justify-center">
                    <FaHandshake className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Misyonumuz
                  </h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Müşterilerimize kaliteli ürünler ve güvenilir hizmet sunarak, iş makineleri sektörünün gelişimine katkıda bulunmak. Yenilikçi çözümler ve profesyonel yaklaşımımızla müşterilerimizin başarısına ortak olmak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaHistory className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100 font-medium">Yıllık Tecrübe</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUsers className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">10000+</div>
              <div className="text-blue-100 font-medium">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTruck className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">20000+</div>
              <div className="text-blue-100 font-medium">Ürün Çeşidi</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">10+</div>
              <div className="text-blue-100 font-medium">Global Marka</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Kaliteli Yedek Parça İhtiyaçlarınız İçin Yanınızdayız
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Bizimle İletişime Geçin
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 