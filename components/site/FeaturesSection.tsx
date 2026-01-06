import { MapPin, Heart, Users, DollarSign } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Localização Privilegiada',
      description: 'Situada em local tranquilo e de fácil acesso, próxima aos principais pontos turísticos e com fácil acesso às principais vias.',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    },
    {
      icon: Heart,
      title: 'Conforto Garantido',
      description: 'Quartos equipados com tudo que você precisa para uma estadia perfeita e relaxante. Cama confortável, banheiro privativo e muito mais.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    },
    {
      icon: Users,
      title: 'Atendimento Personalizado',
      description: 'Nossa equipe está sempre pronta para tornar sua estadia ainda mais especial, com atenção aos detalhes e cuidado genuíno.',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
    },
    {
      icon: DollarSign,
      title: 'Melhor Custo-Benefício',
      description: 'Qualidade e conforto com preços justos, garantindo o melhor valor para sua hospedagem sem comprometer a experiência.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    },
  ]

  return (
    <section id="diferenciais" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Diferenciais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            O que torna a Pousada do Leô especial e única
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
