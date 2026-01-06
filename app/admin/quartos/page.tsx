import RoomsList from '@/components/admin/rooms/RoomsList'

export default function QuartosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quartos</h1>
          <p className="text-gray-600 mt-2">Gerencie os quartos da pousada</p>
        </div>
        <a
          href="/admin/quartos/novo"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Novo Quarto
        </a>
      </div>

      <RoomsList />
    </div>
  )
}

