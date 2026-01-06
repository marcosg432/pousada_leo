import GuestsList from '@/components/admin/guests/GuestsList'

export default function HospedesPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hóspedes</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Gerencie os hóspedes</p>
        </div>
        <a
          href="/admin/hospedes/novo"
          className="bg-primary hover:bg-primary-dark text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base w-full sm:w-auto text-center"
        >
          Novo Hóspede
        </a>
      </div>

      <GuestsList />
    </div>
  )
}

