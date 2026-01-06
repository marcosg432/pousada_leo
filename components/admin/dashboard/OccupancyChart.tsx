import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export default async function OccupancyChart() {
  const now = new Date()
  const months = []
  
  // Últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i)
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    
    const totalRooms = await prisma.room.count()
    
    // Reservas confirmadas/check-in no mês
    const occupiedDays = await prisma.reservation.count({
      where: {
        status: {
          in: ['confirmed', 'checked_in'],
        },
        OR: [
          {
            checkIn: { lte: monthEnd },
            checkOut: { gte: monthStart },
          },
        ],
      },
    })
    
    // Cálculo simplificado: dias ocupados / (total quartos * dias do mês)
    const daysInMonth = monthEnd.getDate()
    const totalRoomDays = totalRooms * daysInMonth
    const occupancyRate = totalRoomDays > 0 
      ? Math.round((occupiedDays / totalRoomDays) * 100) 
      : 0
    
    months.push({
      month: format(monthDate, 'MMM', { locale: ptBR }),
      value: occupancyRate,
    })
  }

  const maxValue = 100

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Taxa de Ocupação (6 meses)</h2>
      {months.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Sem dados disponíveis</p>
        </div>
      ) : (
        <div className="space-y-4">
          {months.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {item.month}
                </span>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((item.value / maxValue) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



