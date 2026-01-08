export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo com overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/decoracao/decoracao-4.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Bem-vindo à<br />
          <span className="text-accent">Pousada do Leô</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed">
          Seu refúgio de tranquilidade e conforto no coração da natureza.
          <br />
          Experiências inesquecíveis esperam por você.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/reservar"
            className="bg-accent hover:bg-accent-dark text-white px-10 py-4 rounded-full text-lg font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Fazer Reserva
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}

