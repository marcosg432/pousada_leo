export default function Banner() {
  return (
    <section className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bem-vindo à Pousada do Leô
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Seu refúgio de tranquilidade e conforto
        </p>
        <a
          href="#contato"
          className="inline-block bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Reservar Agora
        </a>
      </div>
    </section>
  )
}



