import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function GalleryPreview() {
  const images = [
    { id: 1, src: '/locais-turisticos/praia-de-santo-antonio.jpg', alt: 'Praia de Santo Antônio' },
    { id: 2, src: '/locais-turisticos/praia-de-taperinha.webp', alt: 'Praia de Taperinha' },
    { id: 3, src: '/locais-turisticos/praia-do-guity.webp', alt: 'Praia do Guity' },
    { id: 4, src: '/locais-turisticos/Praia-Brava.jpg', alt: 'Praia Brava' },
  ]

  return (
    <section id="galeria" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Localização Privilegiada
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os principais pontos turísticos e atrações próximos à Pousada do Leô
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`${
                index === 0 ? 'h-[500px] md:h-[600px]' : 'h-[300px] md:h-[400px]'
              }`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ver locais turísticos
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}

