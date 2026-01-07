import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import { getRecentReservations } from '@/lib/dashboard'
import { getStatusColor, getStatusLabel } from '@/lib/reservation-helpers'

export default async function RecentReservations() {
  const reservations = await getRecentReservations(5)

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas Recentes</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma reserva encontrada</p>
        </div>
      </div>
    )
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
      <Link
        href="/admin/reservas"
        className="block text-center mt-4 text-primary hover:text-primary-dark font-medium transition"
      >
        Ver todas as reservas →
      </Link>
    </div>
  )
}





