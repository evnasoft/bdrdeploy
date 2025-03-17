import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80 z-10" />
          <div className="absolute inset-0 bg-[url('/images/hero-construction.jpg')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl text-blue-100">
            20 yıllık tecrübemizle iş makinası yedek parça sektörünün öncü firmalarından biriyiz.
          </p>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Hikayemiz</h2>
              <p className="text-gray-600 mb-4">
                2003 yılında küçük bir ofiste başlayan yolculuğumuz, bugün Türkiye'nin önde gelen iş makinası yedek parça tedarikçilerinden biri olarak devam ediyor.
              </p>
              <p className="text-gray-600 mb-4">
                Kurulduğumuz günden bu yana, müşterilerimize en kaliteli ürünleri, en hızlı şekilde ulaştırmayı hedefledik. Bu vizyonumuz sayesinde, sektörde güvenilir ve tercih edilen bir marka haline geldik.
              </p>
              <p className="text-gray-600">
                Geniş ürün yelpazemiz, profesyonel ekibimiz ve müşteri odaklı yaklaşımımızla, iş makinası sahiplerinin ilk tercihi olmaya devam ediyoruz.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1581092162384-8987c1d64926?q=80"
                alt="İş Makinası Servisi"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Güvenilirlik</h3>
              <p className="text-gray-600 text-center">
                Tüm ürünlerimiz orijinal olup, uluslararası kalite standartlarına uygunluk belgesine sahiptir.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Hızlı Çözüm</h3>
              <p className="text-gray-600 text-center">
                Müşterilerimizin ihtiyaçlarına en hızlı şekilde çözüm üretmek için çalışıyoruz.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Uzman Ekip</h3>
              <p className="text-gray-600 text-center">
                Deneyimli ve profesyonel ekibimizle 7/24 hizmet veriyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vizyon & Misyon */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Vizyonumuz</h2>
              <p className="text-gray-600">
                İş makinası yedek parça sektöründe, müşterilerimize en kaliteli ürünleri sunarak, 
                Türkiye'nin ve bölgenin lider tedarikçisi olmak. Teknolojik gelişmeleri yakından 
                takip ederek, sürekli yenilenen ürün yelpazemizle sektöre yön veren firma olmaya 
                devam etmek.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Misyonumuz</h2>
              <p className="text-gray-600">
                Müşterilerimizin ihtiyaçlarını en hızlı ve en ekonomik şekilde karşılamak, 
                kaliteli ürün ve hizmet sunarak müşteri memnuniyetini en üst düzeyde tutmak. 
                İş ortaklarımızla güvene dayalı, uzun vadeli ilişkiler kurarak, sektörün 
                gelişimine katkıda bulunmak.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 