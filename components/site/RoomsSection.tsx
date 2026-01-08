import { Bed, Users, Wifi } from 'lucide-react'

export default function RoomsSection() {
  const rooms = [
    {
      id: 1,
      name: 'Suíte 1',
      description: 'Acomodações Confortáveis: Quartos familiares com banheiros privativos, ar-condicionado e WiFi gratuito.',
      price: 200,
      capacity: 5,
      amenities: ['WiFi', 'TV', 'Ar condicionado', 'Frigobar', 'Micro-ondas', 'Chaleira elétrica'],
    },
    {
      id: 2,
      name: 'Suíte 2',
      description: 'Essa é a suíte 2! Ela acomoda até 6 pessoas em uma cama de casal e duas beliches.',
      price: 200,
      capacity: 6,
      amenities: ['WiFi', 'TV com Netflix', 'Ar condicionado', 'Ventilador', 'Frigobar', 'Micro-ondas'],
    },
    {
      id: 3,
      name: 'Suíte 3',
      description: 'Suíte espaçosa perfeita para famílias, com cama extra.',
      price: 190,
      capacity: 5,
      amenities: ['WiFi', 'TV', 'Ar condicionado', 'Varanda', 'Frigobar'],
    },
    {
      id: 4,
      name: 'Suíte 4',
      description: 'Quarto aconchegante e moderno, ideal para casais ou pequenas famílias.',
      price: 190,
      capacity: 5,
      amenities: ['WiFi', 'TV', 'Ar condicionado', 'Frigobar', 'Micro-ondas'],
    },
  ]

  return (
    <section id="quartos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Quartos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conforto e tranquilidade em cada detalhe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="h-48 bg-gradient-to-br from-primary to-primary-dark"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{room.capacity} pessoas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi size={16} />
                    <span>WiFi</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      R$ {room.price}
                    </span>
                    <span className="text-gray-600">/noite</span>
                  </div>
                  <a
                    href="#contato"
                    className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-full font-semibold transition"
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

