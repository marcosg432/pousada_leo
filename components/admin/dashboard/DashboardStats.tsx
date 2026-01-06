import { Calendar, DollarSign, Bed, Bell, CreditCard, AlertCircle } from 'lucide-react'
import { getDashboardStats } from '@/lib/dashboard'
import Link from 'next/link'

export default async function DashboardStats() {
  const stats = await getDashboardStats()

  const cards = [
    {
      title: 'Reservas Hoje',
      value: stats.reservationsToday.toString(),
      icon: Calendar,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Reservas do Mês',
      value: stats.reservationsMonth.toString(),
      icon: Calendar,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Taxa de Ocupação',
      value: `${stats.occupancyRate}%`,
      subtitle: `${stats.occupiedRooms} de ${stats.totalRooms} quartos`,
      icon: Bed,
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      title: 'Faturamento do Mês',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(stats.revenue),
      icon: DollarSign,
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
  ]

  // Adicionar cards de pagamento
  cards.push(
    {
      title: 'Total Recebido',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(stats.received || 0),
      icon: CreditCard,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-800',
    },
    {
      title: 'Pendente de Pagamento',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(stats.pending || 0),
      icon: AlertCircle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-800',
    },
    {
      title: 'Aguardando Pagamento',
      value: (stats.pendingPaymentCount || 0).toString(),
      icon: Bell,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-800',
    },
    {
      title: 'Reservas Confirmadas',
      value: (stats.confirmedCount || 0).toString(),
      icon: Calendar,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-800',
    }
  )

  // Card especial para novas reservas do site
  if (stats.newSiteReservations > 0) {
    cards.unshift({
      title: 'Novas Reservas do Site',
      value: stats.newSiteReservations.toString(),
      icon: Bell,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-800',
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => {
        const isNewReservations = card.title === 'Novas Reservas do Site'
        
        const cardContent = (
            <div
              className={`bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition ${
                isNewReservations ? 'border-2 border-yellow-400 cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`p-2 md:p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-5 h-5 md:w-6 md:h-6 ${card.iconColor}`} />
                </div>
                {isNewReservations && (
                  <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    NOVO
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">{card.title}</p>
              {card.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
        )

        return isNewReservations ? (
          <Link key={index} href="/admin/reservas?status=pending&source=site" className="block">
            {cardContent}
          </Link>
        ) : (
          <div key={index}>
            {cardContent}
          </div>
        )
      })}
    </div>
  )
}

