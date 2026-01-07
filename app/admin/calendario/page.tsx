import OccupancyCalendar from '@/components/admin/calendar/OccupancyCalendar'

export default function CalendarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendário de Ocupação</h1>
        <p className="text-gray-600 mt-2">Visualize a ocupação dos quartos em formato de grade</p>
      </div>

      <OccupancyCalendar />
    </div>
  )
}





