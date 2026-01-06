import ReservationsList from '@/components/admin/reservations/ReservationsList'

export default function ReservasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-2">Gerencie todas as reservas</p>
        </div>
        <a
          href="/admin/reservas/nova"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Nova Reserva
        </a>
      </div>

      <ReservationsList />
    </div>
  )
}

