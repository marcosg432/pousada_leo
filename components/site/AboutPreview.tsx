export default function AboutPreview() {
  return (
    <section id="sobre" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sobre a Pousada do Leô
            </h2>
            <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
              <p>
                A Pousada do Leô é um refúgio acolhedor que combina o charme
                da hospitalidade brasileira com o conforto moderno. Localizada
                em um ambiente tranquilo e cercado pela natureza, oferecemos uma
                experiência única para quem busca descanso e tranquilidade.
              </p>
              <p>
                Nossa missão é proporcionar momentos inesquecíveis aos nossos
                hóspedes, com atenção especial a cada detalhe e um atendimento
                personalizado que faz toda a diferença. Cada quarto foi pensado
                para oferecer o máximo de conforto e bem-estar.
              </p>
              <p>
                Com anos de experiência em hospitalidade, nossa equipe está
                sempre pronta para tornar sua estadia ainda mais especial,
                criando memórias que durarão para sempre.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/rooms/suite-1/suite-1-5.jpg"
                alt="Fachada da Pousada do Leô"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}





