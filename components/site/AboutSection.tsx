export default function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sobre a Pousada
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                A Pousada do Leô é um refúgio acolhedor que combina o charme
                da hospitalidade brasileira com o conforto moderno. Localizada
                em um ambiente tranquilo, oferecemos uma experiência única
                para quem busca descanso e tranquilidade.
              </p>
              <p>
                Nossa missão é proporcionar momentos inesquecíveis aos nossos
                hóspedes, com atenção especial a cada detalhe e um atendimento
                personalizado que faz toda a diferença.
              </p>
              <p>
                Venha conhecer a Pousada do Leô e descubra por que somos a
                escolha certa para sua estadia.
              </p>
            </div>
          </div>
          <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500 text-lg">Imagem da Pousada</span>
          </div>
        </div>
      </div>
    </section>
  )
}



