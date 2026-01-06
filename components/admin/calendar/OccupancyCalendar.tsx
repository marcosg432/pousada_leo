'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { getStatusColor, getStatusLabel } from '@/lib/reservation-helpers'

interface Reservation {
  id: string
  guestName: string
  status: string
  checkIn: string
  checkOut: string
}

interface OccupancyDay {
  date: string
  reservations: Reservation[]
}

interface RoomOccupancy {
  room: {
    id: string
    number: string
    name: string
  }
  days: OccupancyDay[]
}

export default function OccupancyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [occupancyData, setOccupancyData] = useState<RoomOccupancy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCell, setSelectedCell] = useState<{
    roomId: string
    date: Date
    reservations: Reservation[]
  } | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  useEffect(() => {
    fetchOccupancy()
  }, [currentMonth])

  const fetchOccupancy = async () => {
    try {
      setLoading(true)
      const startDate = format(monthStart, 'yyyy-MM-dd')
      const endDate = format(monthEnd, 'yyyy-MM-dd')

      const response = await fetch(
        `/api/occupancy?startDate=${startDate}&endDate=${endDate}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar ocupação')
      }

      setOccupancyData(data)
    } catch (error) {
      console.error('Error fetching occupancy:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const getDayOccupancy = (roomId: string, date: Date): Reservation[] => {
    const roomData = occupancyData.find((r) => r.room.id === roomId)
    if (!roomData) return []

    const dayStr = format(date, 'yyyy-MM-dd')
    const dayData = roomData.days.find((d) => d.date === dayStr)
    return dayData?.reservations || []
  }

  const getDayStatus = (reservations: Reservation[]): {
    color: string
    label: string
    isOccupied: boolean
  } => {
    if (reservations.length === 0) {
      return {
        color: 'bg-green-100 border-green-300',
        label: 'Disponível',
        isOccupied: false,
      }
    }

    const reservation = reservations[0]
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 border-yellow-400',
      confirmed: 'bg-blue-100 border-blue-400',
      checked_in: 'bg-green-100 border-green-500',
      checked_out: 'bg-gray-100 border-gray-300',
    }

    return {
      color: statusColors[reservation.status] || 'bg-gray-100',
      label: getStatusLabel(reservation.status),
      isOccupied: true,
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Carregando calendário...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header com navegação */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon size={24} />
              {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {occupancyData.length} quartos
          </div>
        </div>
      </div>

      {/* Grade de ocupação */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Cabeçalho com dias */}
          <div className="flex border-b sticky top-0 bg-white z-10">
            <div className="w-48 p-4 font-semibold text-gray-700 border-r bg-gray-50">
              Quarto
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={`flex-1 min-w-[80px] p-2 text-center border-r ${
                  isToday(day) ? 'bg-primary/10 font-bold' : ''
                }`}
              >
                <div className="text-xs text-gray-500">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className="text-sm text-gray-900">
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Linhas de quartos */}
          {occupancyData.map((roomOccupancy) => (
            <div key={roomOccupancy.room.id} className="flex border-b hover:bg-gray-50">
              {/* Nome do quarto */}
              <div className="w-48 p-4 border-r bg-gray-50 font-medium text-gray-900">
                <div className="font-semibold">{roomOccupancy.room.number}</div>
                <div className="text-sm text-gray-600">{roomOccupancy.room.name}</div>
              </div>

              {/* Células de dias */}
              {days.map((day) => {
                const reservations = getDayOccupancy(roomOccupancy.room.id, day)
                const status = getDayStatus(reservations)

                return (
                  <div
                    key={day.toISOString()}
                    className={`flex-1 min-w-[80px] p-1 border-r cursor-pointer transition hover:opacity-80 ${
                      status.color
                    } ${isToday(day) ? 'ring-2 ring-primary' : ''} ${
                      reservations.length > 0 ? 'font-medium' : ''
                    }`}
                    onClick={() =>
                      reservations.length > 0 &&
                      setSelectedCell({
                        roomId: roomOccupancy.room.id,
                        date: day,
                        reservations,
                      })
                    }
                    title={
                      reservations.length > 0
                        ? `${reservations[0].guestName} - ${status.label}`
                        : 'Disponível'
                    }
                  >
                    {reservations.length > 0 ? (
                      <div className="text-xs text-gray-800 truncate">
                        {reservations[0].guestName.split(' ')[0]}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">-</div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
            <span>Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
            <span>Check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Check-out</span>
          </div>
        </div>
      </div>

      {/* Modal de detalhes */}
      {selectedCell && selectedCell.reservations.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCell(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reserva - {format(selectedCell.date, "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            {selectedCell.reservations.map((reservation) => (
              <div key={reservation.id} className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold">Hóspede:</span>{' '}
                  {reservation.guestName}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {getStatusLabel(reservation.status)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Check-in:</span>{' '}
                  {format(new Date(reservation.checkIn + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
                <div>
                  <span className="font-semibold">Check-out:</span>{' '}
                  {format(new Date(reservation.checkOut + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              </div>
            ))}
            <button
              onClick={() => setSelectedCell(null)}
              className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

