import RoomsList from '@/components/admin/rooms/RoomsList'

export default function QuartosPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quartos</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Gerencie os quartos da pousada</p>
        </div>
        <a
          href="/admin/quartos/novo"
          className="bg-primary hover:bg-primary-dark text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base w-full sm:w-auto text-center"
        >
          Novo Quarto
        </a>
      </div>

      <RoomsList />
    </div>
  )
}

