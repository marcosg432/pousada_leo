import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactSection() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '21964154637'
  const formattedPhone = phone.replace(/\D/g, '')

  return (
    <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Telefone</h3>
            <p className="text-white/90">{phone}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-white/90">contato@pousadaleo.com</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Localização</h3>
            <p className="text-white/90">Região Central</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Atendimento</h3>
            <p className="text-white/90">24 horas</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Phone className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Fale Conosco</h3>
            <p className="text-lg text-white/90 mb-8">
              Entre em contato pelo telefone ou WhatsApp para fazer sua reserva
              ou tirar suas dúvidas. Nossa equipe está sempre pronta para ajudar!
            </p>
            <a
              href={`https://wa.me/${formattedPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent hover:bg-accent-dark text-white px-10 py-4 rounded-full text-lg font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              WhatsApp: {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
