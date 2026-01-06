export default function GallerySection() {
  const images = Array.from({ length: 6 }, (_, i) => i + 1)

  return (
    <section id="galeria" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Localização Privilegiada
          </h2>
          <p className="text-xl text-gray-600">
            Descubra os principais pontos turísticos próximos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((index) => (
            <div
              key={index}
              className="aspect-square bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer"
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">Foto {index}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

