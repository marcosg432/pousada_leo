'use client'

import { useState } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { X, MapPin, CheckCircle, Anchor } from 'lucide-react'
import Image from 'next/image'

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = [
    { id: 1, src: '/locais-turisticos/praia-de-santo-antonio.jpg', alt: 'Praia de Santo Antônio', category: 'Praias' },
    { id: 3, src: '/locais-turisticos/praia-de-taperinha.webp', alt: 'Praia de Taperinha', category: 'Praias' },
    { id: 4, src: '/locais-turisticos/praia-do-guity.webp', alt: 'Praia do Guity', category: 'Praias' },
    { id: 5, src: '/locais-turisticos/Praia-Brava.jpg', alt: 'Praia Brava', category: 'Praias' },
    { id: 6, src: '/locais-turisticos/praia-do-saco.jpg', alt: 'Praia do Saco', category: 'Praias' },
    { id: 7, src: '/locais-turisticos/praia-da-ribeira.jpg', alt: 'Praia de Taperinha', category: 'Praias' },
    { id: 11, src: '/locais-turisticos/cachoeiras-de-ingaibe.jpg', alt: 'Cachoeira véu da noiva', category: 'Pontos Turísticos' },
    { id: 12, src: '/locais-turisticos/cais-mangaratiba.jpg', alt: 'Cais de Mangaratiba', category: 'Pontos Turísticos' },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden mt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/decoracao/decoracao-2.jpeg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Pontos Turísticos</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore os principais pontos turísticos e atrações próximos à Pousada do Leô
          </p>
        </div>
      </section>

      {/* Seção Ilha Grande - Destacada */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <Anchor size={20} />
                <span className="font-semibold">Localização Estratégica</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ilha Grande - A Poucos Minutos do Cais de Embarque
              </h2>
              <div className="space-y-4 text-lg text-white/95 leading-relaxed">
                <p>
                  A Pousada do Leô está estrategicamente localizada a poucos minutos do cais de embarque 
                  do centro de Mangaratiba, oferecendo a solução ideal para quem precisa embarcar 
                  para a Ilha Grande pela manhã.
                </p>
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-xl">Economia de Tempo</h3>
                      <p className="text-white/90">Evite deslocamentos longos de madrugada. Acorde próximo ao ponto de embarque.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-xl">Praticidade</h3>
                      <p className="text-white/90">Ideal para quem pega a barca pela manhã, sem necessidade de acordar muito cedo.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-xl">Conforto e Segurança</h3>
                      <p className="text-white/90">Descanse tranquilamente sabendo que está próximo ao seu destino final.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-white/90 font-medium">
                    Localização privilegiada para quem precisa de praticidade e economia de tempo. 
                    Ideal para turistas que embarcam cedo para Ilha Grande.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src="/locais-turisticos/cais-mangaratiba.jpg"
                  alt="Cais de embarque para Ilha Grande - Centro de Mangaratiba"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-white" />
                    <span className="font-semibold">Cais de Embarque - Centro de Mangaratiba</span>
                  </div>
                  <p className="text-white/90 text-sm">
                    Localização estratégica para embarque para Ilha Grande
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Outros Pontos Turísticos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra as praias, cachoeiras e outras atrações da região
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                  index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
                onClick={() => setSelectedImage(image.src)}
              >
                <div className={`${
                  index === 0 ? 'h-[600px]' : 'h-[400px]'
                }`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="text-center text-white opacity-100 group-hover:opacity-100 transition-opacity px-4">
                    <p className="font-bold text-xl md:text-2xl drop-shadow-lg">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Fechar"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Imagem ampliada"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </main>
  )
}

