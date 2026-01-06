import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export default function RecentReservations() {
  // Dados mockados - em produção viriam da API
  const reservations = [
    {
      id: '1',
      guest: 'João Silva',
      room: '101',
      checkIn: new Date('2024-01-15'),
      checkOut: new Date('2024-01-18'),
      status: 'confirmed',
    },
    {
      id: '2',
      guest: 'Maria Santos',
      room: '205',
      checkIn: new Date('2024-01-16'),
      checkOut: new Date('2024-01-20'),
      status: 'checked_in',
    },
    {
      id: '3',
      guest: 'Pedro Costa',
      room: '102',
      checkIn: new Date('2024-01-17'),
      checkOut: new Date('2024-01-19'),
      status: 'pending',
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      checked_in: 'bg-green-100 text-green-800',
      checked_out: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmada',
      checked_in: 'Check-in',
      checked_out: 'Check-out',
      cancelled: 'Cancelada',
    }
    return labels[status] || status
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas Recentes</h2>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{reservation.guest}</h3>
              <p className="text-sm text-gray-600">
                Quarto {reservation.room} •{' '}
                {format(reservation.checkIn, "dd 'de' MMM", { locale: ptBR })} -{' '}
                {format(reservation.checkOut, "dd 'de' MMM", { locale: ptBR })}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                reservation.status
              )}`}
            >
              {getStatusLabel(reservation.status)}
            </span>
          </div>
        ))}
      </div>
      <a
        href="/admin/reservas"
        className="block text-center mt-4 text-primary hover:text-primary-dark font-medium"
      >
        Ver todas as reservas →
      </a>
    </div>
  )
}

