'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  showThumbnails?: boolean
  autoPlay?: boolean
  interval?: number
}

export default function ImageCarousel({
  images,
  alt,
  className = '',
  showThumbnails = true,
  autoPlay = false,
  interval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Sem imagens</span>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const openModal = (index: number) => {
    setModalIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const goToPreviousModal = () => {
    setModalIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNextModal = () => {
    setModalIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Sincronizar modalIndex com currentIndex quando modal abrir
  useEffect(() => {
    if (isModalOpen) {
      setModalIndex(currentIndex)
    }
  }, [isModalOpen, currentIndex])

  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Imagem principal */}
        <div className="relative overflow-hidden rounded-lg bg-gray-100" style={{ minHeight: '500px' }}>
          <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${alt} - Imagem ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                onClick={() => openModal(index)}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          
          {/* Botão de ampliar */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              openModal(currentIndex)
            }}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all z-20 shadow-lg"
            aria-label="Ampliar imagem"
          >
            <Maximize2 size={20} />
          </button>

          {/* Botões de navegação - sempre visíveis quando há múltiplas imagens */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all z-20 shadow-lg"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all z-20 shadow-lg"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
              </button>

              {/* Contador de imagens */}
              <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium z-20 backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Indicadores de posição */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToImage(index)
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white shadow-lg'
                      : 'w-2.5 bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  index === currentIndex
                    ? 'border-primary scale-105 shadow-md'
                    : 'border-gray-200 hover:border-primary/50 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`${alt} - Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de visualização ampliada */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
            aria-label="Fechar"
          >
            <X size={32} />
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[modalIndex]}
              alt={`${alt} - Visualização ampliada ${modalIndex + 1}`}
              className="w-full h-full object-contain max-h-[90vh] mx-auto"
            />

            {/* Botões de navegação no modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPreviousModal}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={goToNextModal}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight size={32} />
                </button>

                {/* Contador de imagens */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                  {modalIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

