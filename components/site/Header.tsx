'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo/logo.png"
              alt="Pousada do Leô"
              width={1200}
              height={345}
              className="h-32 md:h-40 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#quartos" className="text-gray-700 hover:text-primary transition font-medium whitespace-nowrap">
              Quartos
            </Link>
            <Link href="/galeria" className="text-gray-700 hover:text-primary transition font-medium whitespace-nowrap">
              Pontos Turísticos
            </Link>
            <Link href="/empresas" className="text-gray-700 hover:text-primary transition font-medium whitespace-nowrap">
              Empresas
            </Link>
            <Link href="/contato" className="text-gray-700 hover:text-primary transition font-medium whitespace-nowrap">
              Contato
            </Link>
            <Link
              href="/reservar"
              className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-full font-semibold transition shadow-lg hover:shadow-xl whitespace-nowrap ml-2"
            >
              Reservar Agora
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <Link
                href="/#quartos"
                className="text-gray-700 hover:text-primary transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Quartos
              </Link>
              <Link
                href="/galeria"
                className="text-gray-700 hover:text-primary transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pontos Turísticos
              </Link>
              <Link
                href="/empresas"
                className="text-gray-700 hover:text-primary transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Empresas
              </Link>
              <Link
                href="/contato"
                className="text-gray-700 hover:text-primary transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link
                href="/reservar"
                className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-full font-semibold transition text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Reservar Agora
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
