import { Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '21964154637'
  const formattedPhone = phone.replace(/\D/g, '')

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Image
                src="/logo/logo.png"
                alt="Pousada do Leô"
                width={1200}
                height={345}
                className="h-32 md:h-40 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Seu refúgio de tranquilidade e conforto no coração da natureza.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/#quartos" className="text-gray-400 hover:text-white transition">
                Quartos
              </Link>
              <Link href="/sobre" className="text-gray-400 hover:text-white transition">
                Sobre
              </Link>
              <Link href="/galeria" className="text-gray-400 hover:text-white transition">
                Galeria
              </Link>
              <Link href="/contato" className="text-gray-400 hover:text-white transition">
                Contato
              </Link>
              <Link href="/regras" className="text-gray-400 hover:text-white transition">
                Regras e Políticas
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <div className="flex items-center gap-3 text-gray-400">
              <Phone className="w-5 h-5" />
              <a
                href={`tel:${formattedPhone}`}
                className="hover:text-white transition underline-offset-2 hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Pousada do Leô. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
