import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { Heart, Users, Award, Coffee } from 'lucide-react'

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: 'Hospitalidade',
      description: 'Tratamos cada hóspede como parte da família, com atenção e cuidado genuíno.',
    },
    {
      icon: Users,
      title: 'Atendimento Personalizado',
      description: 'Nossa equipe está sempre pronta para tornar sua estadia ainda mais especial.',
    },
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Mantemos altos padrões de qualidade em todos os aspectos da pousada.',
    },
    {
      icon: Coffee,
      title: 'Conforto',
      description: 'Priorizamos o conforto e bem-estar dos nossos hóspedes em cada detalhe.',
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Sobre a Pousada</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Conheça nossa história e valores
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
                <p>
                  A Pousada do Leô nasceu do sonho de oferecer um refúgio acolhedor
                  onde as pessoas pudessem encontrar paz, conforto e momentos
                  inesquecíveis. Fundada com o propósito de combinar o charme da
                  hospitalidade brasileira com o conforto moderno, nossa pousada
                  se tornou um destino especial para quem busca descanso e
                  tranquilidade.
                </p>
                <p>
                  Localizada em um ambiente tranquilo e cercado pela natureza,
                  cada detalhe da Pousada do Leô foi pensado para proporcionar
                  uma experiência única e memorável. Desde a decoração acolhedora
                  dos quartos até o atendimento personalizado, tudo é feito com
                  carinho e dedicação.
                </p>
                <p>
                  Ao longo dos anos, temos recebido hóspedes de todas as partes,
                  criando memórias especiais e estabelecendo relacionamentos
                  duradouros. Nossa missão continua sendo proporcionar momentos
                  inesquecíveis, com atenção especial a cada detalhe.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
                  alt="Fachada da Pousada do Leô"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                  alt="Interior da Pousada"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nossa Missão
              </h2>
              <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
                <p>
                  Proporcionar momentos inesquecíveis aos nossos hóspedes,
                  oferecendo um ambiente acolhedor, confortável e seguro, onde
                  cada detalhe é pensado para garantir o máximo de bem-estar.
                </p>
                <p>
                  Acreditamos que uma estadia perfeita vai além de um quarto
                  confortável. É sobre criar memórias, proporcionar experiências
                  únicas e fazer com que cada hóspede se sinta em casa, mas com
                  o cuidado e atenção que só uma pousada acolhedora pode oferecer.
                </p>
                <p>
                  Nossa equipe está sempre pronta para tornar sua estadia ainda
                  mais especial, com atenção aos detalhes e um serviço que faz
                  toda a diferença.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}



