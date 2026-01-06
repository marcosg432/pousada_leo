import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import { getTodayReservations } from '@/lib/dashboard'
import { getStatusColor, getStatusLabel } from '@/lib/reservation-helpers'

export default async function TodayReservations() {
  const reservations = await getTodayReservations()

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas de Hoje</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma reserva para hoje</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Reservas de Hoje</h2>
      <div className="space-y-3">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{reservation.guest.name}</h3>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-sm text-gray-600">Quarto {reservation.room.number}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {reservation.checkIn <= new Date() && reservation.checkOut >= new Date()
                  ? 'Em andamento'
                  : reservation.checkIn > new Date()
                  ? `Check-in: ${format(reservation.checkIn, "HH:mm", { locale: ptBR })}`
                  : `Check-out: ${format(reservation.checkOut, "HH:mm", { locale: ptBR })}`}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
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
        className="block text-center mt-4 text-primary hover:text-primary-dark font-medium transition text-sm"
      >
        Ver todas →
      </Link>
    </div>
  )
}



