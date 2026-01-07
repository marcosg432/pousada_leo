'use client'

import { useState } from 'react'
import { Bed, Users, Wifi, ArrowRight, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import Link from 'next/link'

export default function RoomsPreview() {
  const [modalOpen, setModalOpen] = useState<{ roomId: number; imageIndex: number } | null>(null)

  const rooms = [
    {
      id: 1,
      name: 'Suíte 1',
      description: 'Acomodações Confortáveis: Quartos familiares com banheiros privativos, ar-condicionado e WiFi gratuito. Cada quarto inclui geladeira, micro-ondas, TV e chaleira elétrica.',
      price: 200,
      capacity: 8,
      amenities: ['WiFi', 'TV', 'Ar condicionado', 'Geladeira', 'Micro-ondas', 'Chaleira elétrica'],
      image: '/rooms/suite-1/suite-1-5.jpg',
      images: [
        '/rooms/suite-1/suite-1-5.jpg',
        '/rooms/suite-1/suite-1-1.jpg',
        '/rooms/suite-1/suite-1-2.jpg',
        '/rooms/suite-1/suite-1-3.jpg',
        '/rooms/suite-1/suite-1-4.jpg',
        '/rooms/suite-1/suite-1-6.jpg',
        '/rooms/suite-1/suite-1-7.jpg',
        '/rooms/suite-1/suite-1-8.jpg',
        '/rooms/suite-1/suite-1-9.jpg',
        '/rooms/suite-1/suite-1-10.jpg',
        '/rooms/suite-1/suite-1-11.jpg',
      ],
    },
    {
      id: 2,
      name: 'Suíte 2',
      description: 'Essa é a suíte 2! Ela acomoda até 6 pessoas em uma cama de casal e duas beliches.',
      price: 200,
      capacity: 6,
      amenities: ['WiFi', 'TV com Netflix', 'Ar condicionado', 'Ventilador', 'Frigobar', 'Micro-ondas'],
      image: '/rooms/suite-2/suite-2-4.jpeg',
      images: [
        '/rooms/suite-2/suite-2-4.jpeg',
        '/rooms/suite-2/suite-2-1.jpeg',
        '/rooms/suite-2/suite-2-2.jpeg',
        '/rooms/suite-2/suite-2-3.jpeg',
        '/rooms/suite-2/suite-2-5.jpeg',
        '/rooms/suite-2/suite-2-6.jpeg',
      ],
    },
  ]

  const RoomCarousel = ({ room }: { room: typeof rooms[0] }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const images = room.images || [room.image]

    const goToPrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const openModal = () => {
      setModalOpen({ roomId: room.id, imageIndex: currentIndex })
    }

    return (
      <div className="relative h-64 overflow-hidden group">
        <img
          src={images[currentIndex]}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          onClick={openModal}
        />
        
        {/* Botão de ampliar */}
        <button
          onClick={openModal}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Ampliar imagem"
        >
          <Maximize2 size={16} />
        </button>

        {/* Botões de navegação */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <section id="quartos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Quartos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conforto e tranquilidade em cada detalhe. Escolha o ambiente perfeito para sua estadia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group flex flex-col h-full"
            >
              <div className="relative">
                <RoomCarousel room={room} />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                  <span className="text-sm font-semibold text-primary">
                    R$ {room.price}/noite
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">{room.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-primary" />
                    <span>{room.capacity} pessoas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi size={16} className="text-primary" />
                    <span>WiFi</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                  {room.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>

                <a
                  href="/reservar"
                  className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 group-hover:shadow-lg mt-auto"
                >
                  Reservar Agora
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/quartos"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-lg transition group"
          >
            Ver todos os quartos
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Modal de visualização ampliada */}
      {modalOpen && <ImageModal roomId={modalOpen.roomId} initialIndex={modalOpen.imageIndex} rooms={rooms} onClose={() => setModalOpen(null)} />}
    </section>
  )
}

type Room = {
  id: number
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  image: string
  images: string[]
}

function ImageModal({ roomId, initialIndex, rooms, onClose }: { roomId: number; initialIndex: number; rooms: Room[]; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const room = rooms.find((r) => r.id === roomId)
  
  if (!room) return null
  
  const images = room.images || [room.image]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
        aria-label="Fechar"
      >
        <X size={32} />
      </button>

      <div className="relative max-w-7xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`${room.name} - Visualização ampliada ${currentIndex + 1}`}
          className="w-full h-full object-contain max-h-[90vh] mx-auto"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

