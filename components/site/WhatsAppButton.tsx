'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '21964154637'
  const formattedPhone = phone.replace(/\D/g, '')
  const message = encodeURIComponent('Olá! Gostaria de fazer uma reserva na Pousada do Leô.')

  return (
    <a
      href={`https://wa.me/${formattedPhone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition transform hover:scale-110 z-50"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  )
}



