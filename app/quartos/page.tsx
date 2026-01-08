import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import ImageCarousel from '@/components/site/ImageCarousel'
import { Bed, Users, Wifi, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

export default function QuartosPage() {
  const rooms = [
    {
      id: 1,
      name: 'Suíte 1',
      description: 'Acomodações Confortáveis: Quartos familiares com banheiros privativos, ar-condicionado e WiFi gratuito. Cada quarto inclui frigobar, micro-ondas, TV e chaleira elétrica.',
      fullDescription: 'Acomodações Confortáveis: A Pousada do Leô em Mangaratiba oferece quartos familiares com banheiros privativos, ar-condicionado e WiFi gratuito. Cada quarto inclui frigobar, micro-ondas, TV e chaleira elétrica. Comodidades Convenientes: Os hóspedes se beneficiam de um serviço pago de traslado para o aeroporto, recepção 24 horas e serviços de streaming. A pousada possui um pátio interno e vista para uma rua tranquila, garantindo uma estadia pacífica.',
      price: 200,
      capacity: 5,
      amenities: ['WiFi gratuito', 'TV', 'Ar condicionado', 'Banheiro privativo', 'Frigobar', 'Micro-ondas', 'Chaleira elétrica', 'Serviço de streaming', 'Recepção 24h', 'Pátio interno', 'Vista para rua tranquila'],
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
      fullDescription: 'Essa é a suíte 2! Ela acomoda até 6 pessoas em uma cama de casal e duas beliches. Possui banheiro privativo com chuveiro quente, ar condicionado, ventilador, TV com netflix, wifi, frigobar e micro-ondas. Lençóis, toalhas, travesseiros e cobertas Inclusos!',
      price: 200,
      capacity: 6,
      amenities: ['WiFi gratuito', 'TV com Netflix', 'Ar condicionado', 'Ventilador', 'Frigobar', 'Micro-ondas', 'Banheiro privativo', 'Chuveiro quente', 'Lençóis', 'Toalhas', 'Travesseiros', 'Cobertas'],
      image: '/rooms/suite-2/suite-2-4.jpeg',
      images: [
        '/rooms/suite-2/suite-2-4.jpeg',
        '/rooms/suite-2/suite-2-2.jpeg',
        '/rooms/suite-2/suite-2-3.jpeg',
        '/rooms/suite-2/suite-2-5.jpeg',
        '/rooms/suite-2/suite-2-6.jpeg',
      ],
    },
    {
      id: 3,
      name: 'Suíte 3',
      description: 'Suíte espaçosa com cama extra, ideal para famílias que buscam conforto, espaço e comodidade para todos.',
      fullDescription: 'A Suíte 3 foi pensada especialmente para famílias, oferecendo espaço amplo e confortável para até 5 pessoas. Com cama extra, área de descanso e todas as comodidades necessárias, é perfeita para momentos em família.',
      price: 190,
      capacity: 5,
      amenities: ['WiFi gratuito', 'TV LED 43"', 'Ar condicionado', 'Varanda privativa', 'Banheiro privativo', 'Frigobar', 'Cama extra', 'Roupas de cama', 'Toalhas', 'Área de descanso'],
      image: '/rooms/suite-3/suite-3-5.jpeg',
      images: [
        '/rooms/suite-3/suite-3-5.jpeg',
        '/rooms/suite-3/suite-3-1.jpeg',
        '/rooms/suite-3/suite-3-2.jpeg',
        '/rooms/suite-3/suite-3-3.jpeg',
      ],
    },
    {
      id: 4,
      name: 'Suíte 4',
      description: 'Quarto aconchegante e moderno, ideal para casais ou pequenas famílias. Ambiente acolhedor com todas as comodidades necessárias.',
      fullDescription: 'A Suíte 4 oferece um ambiente aconchegante e moderno, perfeito para casais ou pequenas famílias. Com decoração cuidadosa, cama de casal confortável e banheiro privativo, proporciona uma estadia tranquila e relaxante. Inclui todas as comodidades essenciais para seu conforto.',
      price: 190,
      capacity: 5,
      amenities: ['WiFi gratuito', 'TV', 'Ar condicionado', 'Banheiro privativo', 'Frigobar', 'Micro-ondas', 'Cama de casal', 'Roupas de cama', 'Toalhas'],
      image: '/rooms/suite-4/suite-4-5.jpeg',
      images: [
        '/rooms/suite-4/suite-4-5.jpeg',
        '/rooms/suite-4/suite-4-1.jpeg',
        '/rooms/suite-4/suite-4-2.jpeg',
        '/rooms/suite-4/suite-4-3.jpeg',
        '/rooms/suite-4/suite-4-4.jpeg',
        '/rooms/suite-4/suite-4-6.jpeg',
        '/rooms/suite-4/suite-4-7.jpeg',
      ],
    },
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Nossos Quartos</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Conforto e tranquilidade em cada detalhe
          </p>
        </div>
      </section>

      {/* Rooms List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative">
                    <ImageCarousel
                      images={room.images || [room.image]}
                      alt={room.name}
                      className="h-[500px]"
                      showThumbnails={true}
                    />
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full z-10">
                      <span className="text-2xl font-bold text-primary">
                        R$ {room.price}
                        <span className="text-lg text-gray-600">/noite</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                    <Bed size={20} />
                    <span className="font-semibold">{room.name}</span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{room.name}</h2>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {room.fullDescription}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={20} className="text-primary" />
                        <span className="font-medium">Até {room.capacity} pessoas</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Wifi size={20} className="text-primary" />
                        <span className="font-medium">WiFi gratuito</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-600">
                          <Check size={16} className="text-green-500" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="/reservar"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Reservar Agora
                    <ArrowRight size={20} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para sua estadia?</h2>
          <p className="text-xl mb-8 text-white/90">
            Entre em contato e faça sua reserva agora mesmo
          </p>
          <a
            href="/reservar"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-10 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Fazer Reserva
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}

