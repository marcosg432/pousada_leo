import Header from '@/components/site/Header'
import ContactSection from '@/components/site/ContactSection'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { Phone } from 'lucide-react'

export default function ContatoPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden mt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Phone className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Estamos prontos para atender você e tornar sua estadia inesquecível
          </p>
        </div>
      </section>

      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

