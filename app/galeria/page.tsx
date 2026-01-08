'use client'

import { useState } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { X } from 'lucide-react'

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = [
    { id: 1, src: '/locais-turisticos/praia-de-santo-antonio.jpg', alt: 'Praia de Santo Antônio', category: 'Praias' },
    { id: 2, src: '/locais-turisticos/clube-nautico-dos-mangaras.webp', alt: 'Clube Náutico dos Mangaras', category: 'Pontos Turísticos' },
    { id: 3, src: '/locais-turisticos/praia-de-taperinha.webp', alt: 'Praia de Taperinha', category: 'Praias' },
    { id: 4, src: '/locais-turisticos/praia-do-guity.webp', alt: 'Praia do Guity', category: 'Praias' },
    { id: 5, src: '/locais-turisticos/Praia-Brava.jpg', alt: 'Praia Brava', category: 'Praias' },
    { id: 6, src: '/locais-turisticos/praia-do-saco.jpg', alt: 'Praia do Saco', category: 'Praias' },
    { id: 7, src: '/locais-turisticos/praia-da-ribeira.jpg', alt: 'Praia da Ribeira', category: 'Praias' },
    { id: 8, src: '/locais-turisticos/praia-da-junqueira.jpg', alt: 'Praia da Junqueira', category: 'Praias' },
    { id: 9, src: '/locais-turisticos/praia-do-sahy.jpg', alt: 'Praia do Sahy', category: 'Praias' },
    { id: 10, src: '/locais-turisticos/praia-grande.jpg', alt: 'Praia Grande', category: 'Praias' },
    { id: 11, src: '/locais-turisticos/cachoeiras-de-ingaibe.jpg', alt: 'Cachoeiras de Ingaíbe', category: 'Pontos Turísticos' },
    { id: 12, src: '/locais-turisticos/cais-mangaratiba.webp', alt: 'Cais de Mangaratiba', category: 'Pontos Turísticos' },
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Localização Privilegiada</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore os principais pontos turísticos e atrações próximos à Pousada do Leô
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

