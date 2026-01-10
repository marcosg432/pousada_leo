'use client'

import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { MapPin, Clock, Building2, Users, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function EmpresasPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '21964154637'
  const formattedPhone = phone.replace(/\D/g, '')

  const distancias = [
    {
      nome: 'Casa da Vale / Terminal da Vale (Ilha Guaíba)',
      distancia: 'Aproximadamente 1 minuto',
      imagem: '/empresas/casa-da-vale.jpeg',
      mapa: 'https://www.google.com/maps/place/Casa+da+Vale+-+Embarcadouro/@-22.9789072,-44.0590724,14z/data=!4m10!1m2!2m1!1sCasa+da+Vale+%2F+Terminal+da+Vale+(Ilha+Gua%C3%ADba)!3m6!1s0x9c15d35c093895:0x5cf723b85ddd362a!8m2!3d-22.9575198!4d-44.0456843!15sCi5DYXNhIGRhIFZhbGUgLyBUZXJtaW5hbCBkYSBWYWxlIChJbGhhIEd1YcOtYmEpWiwiKmNhc2EgZGEgdmFsZSB0ZXJtaW5hbCBkYSB2YWxlIGlsaGEgZ3Vhw61iYZIBEGNvcnBvcmF0ZV9vZmZpY2WaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVUlNhbDkyV25kUlJSQULgAQD6AQQIABBH!16s%2Fg%2F11lgmw4wx0?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      nome: 'Condomínio Pier 51',
      distancia: 'Aproximadamente 19 minutos',
      imagem: '/empresas/condominio-pier-51.jpg',
      mapa: 'https://www.google.com/maps/place/Condom%C3%ADnio+Pier+51+-+Rodovia+Rio+Santos+S%2FNumero+Km+51+-+Concei%C3%A7%C3%A3o+de+Jacare%C3%AD,+Mangaratiba+-+RJ,+23860-000/@-23.0336359,-44.1471315,17z/data=!3m1!4b1!4m6!3m5!1s0x9c43b9c6365b73:0x2616c63e57c22ce4!8m2!3d-23.0336409!4d-44.1445566!16s%2Fg%2F1ptxcjw_m?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      nome: 'Condomínio Sítio Bom',
      distancia: 'Aproximadamente 17 minutos',
      imagem: '/empresas/condominio-sitio-bom.jpg',
      mapa: 'https://www.google.com/maps/place/Condom%C3%ADnio+S%C3%ADtio+Bom/@-22.9754607,-44.0858306,17z/data=!3m1!4b1!4m6!3m5!1s0x9c6a97c67f81e3:0xfdad68ad106fbdb4!8m2!3d-22.9754657!4d-44.0832557!16s%2Fg%2F11g7zgg1m7?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      nome: 'Condomínio Cação',
      distancia: 'Aproximadamente 12 minutos',
      imagem: '/empresas/condominio-cacao.webp',
      mapa: 'https://www.google.com/maps/place/Condom%C3%ADnio+Ca%C3%A7%C3%A3o/@-22.948466,-44.0683326,17z/data=!3m1!4b1!4m6!3m5!1s0x9c15581de2eb9d:0x769d8b69aee012c5!8m2!3d-22.948471!4d-44.0657577!16s%2Fg%2F11n8ttr4qm?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      nome: 'Club Med Rio das Pedras',
      distancia: 'Aproximadamente 22 minutos',
      imagem: '/empresas/club-med-rio-das-pedras.jpg',
      mapa: 'https://www.google.com/maps/place/Club+Med+Rio+Das+Pedras/@-22.995632,-44.0993753,17z/data=!4m9!3m8!1s0x997f6099cc3d41:0xab407b01e428c99c!5m2!4m1!1i2!8m2!3d-22.995637!4d-44.0968004!16s%2Fg%2F1tdmr8d9?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      nome: 'Portobello Resort',
      distancia: 'Aproximadamente 14 minutos',
      imagem: '/empresas/portobello-resort.jpg',
      mapa: 'https://www.google.com/maps/place/Portobello+Resort+%26+Saf%C3%A1ri/@-22.9515374,-44.0798105,17z/data=!3m1!4b1!4m9!3m8!1s0x9c6a9a8337cdd7:0xe20a66eb67847410!5m2!4m1!1i2!8m2!3d-22.9515424!4d-44.0749396!16s%2Fg%2F11crzf8dnl?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      nome: 'Hotel Porto Real',
      distancia: 'Aproximadamente 28 minutos',
      imagem: '/empresas/hotel-porto-real.jpg',
      mapa: 'https://www.google.com/maps/place/Hotel+Porto+Real/@-23.0357016,-44.1551861,17z/data=!4m9!3m8!1s0x9c439790749def:0x61cb3cde96c15a95!5m2!4m1!1i2!8m2!3d-23.0357066!4d-44.1526112!16s%2Fg%2F1tdx9y73?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
    {
      nome: 'Conceição de Jacareí',
      distancia: 'Aproximadamente 17 minutos',
      imagem: '/empresas/conceicao-de-jacarei.avif',
      mapa: 'https://www.google.com/maps/place/Conceição+de+Jacareí,+Mangaratiba+-+RJ/@-23.0357016,-44.1551861,17z/data=!4m6!3m5!1s0x9c4197bc70c389:0xf7b589322a5a8cab!8m2!3d-22.9863249!4d-44.0853346!16s%2Fg%2F1ymvg9kk3?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoASAFQAw%3D%3D',
    },
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden mt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/decoracao/decoracao-2.jpeg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4 text-white max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Hospedagem para Empresas e Prestadores de Serviço
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
            Solução completa para empresas que precisam de hospedagem estratégica na região de Mangaratiba
          </p>
        </div>
      </section>

      {/* Seção Vale Terminal Ilha Guaíba - Destacada */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                <Building2 size={20} />
                <span className="font-semibold">Localização Estratégica</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Casa da Vale / Terminal da Vale (Ilha Guaíba)
              </h2>
              <div className="space-y-4 text-lg text-white/95 leading-relaxed">
                <p>
                  A Pousada do Leô está estrategicamente localizada a aproximadamente 1 minuto do 
                  Casa da Vale / Terminal da Vale (Ilha Guaíba), oferecendo a solução ideal para 
                  colaboradores de empresas e equipes técnicas que precisam embarcar cedo.
                </p>
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-xl">Economia de Tempo</h3>
                      <p className="text-white/90">Evite deslocamentos longos de madrugada. Acorde próximo ao terminal de embarque.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-xl">Praticidade</h3>
                      <p className="text-white/90">Ideal para equipes que embarcam pela manhã, sem necessidade de acordar muito cedo ou enfrentar trânsito.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 text-xl">Conforto e Segurança</h3>
                      <p className="text-white/90">Descanse tranquilamente sabendo que está próximo ao ponto de embarque, ideal para colaboradores de empresas.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-white/90 font-medium">
                    Localização privilegiada para empresas que precisam de praticidade e economia de tempo. 
                    Ideal para equipes técnicas, colaboradores e prestadores de serviço que embarcam cedo para Ilha Guaíba.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src="/empresas/vale-terminal-ilha-guaiba.jpg"
                  alt="Casa da Vale / Terminal da Vale (Ilha Guaíba)"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-white" />
                    <span className="font-semibold">Casa da Vale / Terminal da Vale (Ilha Guaíba)</span>
                  </div>
                  <p className="text-white/90 text-sm">
                    Aproximadamente 1 minuto da Pousada do Leô
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospedagem para Empresas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hospedagem para Empresas e Prestadores de Serviço
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solução completa para empresas que precisam de hospedagem estratégica na região
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Colaboradores de Empresas</h3>
              <p className="text-gray-600 leading-relaxed">
                Hospedagem confortável para equipes que trabalham na região, com fácil acesso 
                aos principais pontos de operação.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Equipes Técnicas</h3>
              <p className="text-gray-600 leading-relaxed">
                Acomodação prática para equipes técnicas que precisam de base próxima aos 
                locais de trabalho e pontos de embarque.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Prestadores de Serviço</h3>
              <p className="text-gray-600 leading-relaxed">
                Solução ideal para prestadores de serviço temporários que atuam na região, 
                oferecendo conforto e praticidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Distâncias Estratégicas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Distâncias Estratégicas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Localização privilegiada próxima aos principais pontos de interesse da região
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {distancias.map((local, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={local.imagem}
                    alt={local.nome}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold text-sm">{local.distancia}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{local.nome}</h3>
                  {local.mapa && (
                    <a
                      href={local.mapa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      <MapPin className="w-4 h-4" />
                      Ver localização
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chamada para Contato */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hospedagem para Empresas e Equipes
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco para conhecer nossos pacotes corporativos e condições especiais 
            para hospedagem de equipes. Oferecemos soluções personalizadas para atender às necessidades 
            da sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`https://wa.me/${formattedPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent hover:bg-accent-dark text-white px-10 py-4 rounded-full text-lg font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              Fale Conosco
              <ArrowRight size={20} />
            </a>
            <Link
              href="/contato"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-full text-lg font-semibold transition-all border-2 border-white/30 inline-flex items-center gap-2"
            >
              Ver Mais Informações
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}

