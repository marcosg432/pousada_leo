import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pousada do Leô - Hospedagem Acolhedora',
  description: 'Bem-vindo à Pousada do Leô, um lugar acolhedor para seu descanso e tranquilidade.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}





