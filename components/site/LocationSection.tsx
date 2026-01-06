import { MapPin, Navigation } from 'lucide-react'

export default function LocationSection() {
  // Endereço da Pousada do Leô
  const address = "Rua Artur Pires 158 Casa, Mangaratiba, CEP 23860-000, Brasil"
  // URL do Google Maps embed com o endereço
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <MapPin size={20} />
              <span className="font-semibold">Localização</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bem Localizada,<br />
              Fácil Acesso
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                A Pousada do Leô está estrategicamente localizada em uma região
                tranquila, mas com fácil acesso às principais atrações e vias de
                acesso. O ambiente sereno permite que você desfrute de momentos
                de paz e descanso.
              </p>
              <p>
                Estamos próximos aos principais pontos turísticos, restaurantes
                e comércios, facilitando sua estadia e permitindo que você
                explore tudo que a região tem a oferecer.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Navigation size={20} className="text-primary" />
                <span>Fácil acesso</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={20} className="text-primary" />
                <span>Localização privilegiada</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Localização da Pousada do Leô"
              ></iframe>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

