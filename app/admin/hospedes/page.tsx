import GuestsList from '@/components/admin/guests/GuestsList'

export default function HospedesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hóspedes</h1>
          <p className="text-gray-600 mt-2">Gerencie os hóspedes</p>
        </div>
        <a
          href="/admin/hospedes/novo"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Novo Hóspede
        </a>
      </div>

      <GuestsList />
    </div>
  )
}

