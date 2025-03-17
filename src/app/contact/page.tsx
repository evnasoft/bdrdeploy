'use client'

import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaArrowRight } from 'react-icons/fa'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({
    type: null,
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        throw new Error(data.error || 'Bir hata oluştu')
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">
              İletişim
            </h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Sorularınız veya talepleriniz için bize ulaşabilirsiniz. En kısa sürede size geri dönüş yapacağız.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* İletişim Bilgileri */}
          <div>
            <div className="sticky top-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                İletişim Bilgilerimiz
              </h2>
              
              <div className="space-y-8">
                {/* Telefon */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
                      <FaPhone className="w-6 h-6 text-blue-600 group-hover:text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefon</h3>
                    <p className="text-lg text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                      <a href="tel:+905432563717">
                        +90 543 256 37 17
                      </a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="bg-green-100 p-4 rounded-xl group-hover:bg-green-600 transition-colors duration-300">
                      <FaWhatsapp className="w-6 h-6 text-green-600 group-hover:text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-lg text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                      <a href="https://wa.me/905432563717" target="_blank" rel="noopener noreferrer">
                        +90 543 256 37 17
                      </a>
                    </p>
                  </div>
                </div>

                {/* E-posta */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="bg-yellow-100 p-4 rounded-xl group-hover:bg-yellow-600 transition-colors duration-300">
                      <FaEnvelope className="w-6 h-6 text-yellow-600 group-hover:text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">E-posta</h3>
                    <p className="text-lg text-gray-600 group-hover:text-yellow-600 transition-colors duration-300">
                      <a href="mailto:info@bdrspareparts.com">
                        info@bdrspareparts.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Adres */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="bg-red-100 p-4 rounded-xl group-hover:bg-red-600 transition-colors duration-300">
                      <FaMapMarkerAlt className="w-6 h-6 text-red-600 group-hover:text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Adres</h3>
                    <p className="text-lg text-gray-600">
                      ivedik osb. 1479. sokak no:7 Yenimahalle/Ankara
                    </p>
                  </div>
                </div>

                {/* Çalışma Saatleri */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-100 p-4 rounded-xl group-hover:bg-purple-600 transition-colors duration-300">
                      <FaClock className="w-6 h-6 text-purple-600 group-hover:text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Çalışma Saatleri</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Pazartesi - Cuma </span>
                        <span className="font-medium">08:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Cumartesi</span>
                        <span className="font-medium">08:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Pazar</span>
                        <span className="font-medium">Kapalı</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İletişim Formu */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Bize Ulaşın
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {status.type && (
                  <div
                    className={`p-4 rounded-xl ${
                      status.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Adınız Soyadınız
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresiniz
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Numaranız
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                    loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700 hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    'Gönderiliyor...'
                  ) : (
                    <>
                      Mesaj Gönder
                      <FaArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Harita */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Konum
          </h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.658786636383!2d32.74589047580521!3d39.99372997151075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d336281d5cc49d%3A0x4ca43dc0e749d81f!2zQsSxZMSxcmTEsW_En2x1!5e0!3m2!1str!2str!4v1741455468142!5m2!1str!2str "
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 