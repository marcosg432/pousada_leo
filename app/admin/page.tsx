import DashboardStats from '@/components/admin/dashboard/DashboardStats'
import RecentReservations from '@/components/admin/dashboard/RecentReservations'
import TodayReservations from '@/components/admin/dashboard/TodayReservations'
import OccupancyChart from '@/components/admin/dashboard/OccupancyChart'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral da Pousada do Leô</p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentReservations />
        </div>
        <div>
          <TodayReservations />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart />
      </div>
    </div>
  )
}

