// Helpers para calendário de ocupação estilo grade

import { prisma } from './prisma'
import { startOfDay, endOfDay, eachDayOfInterval, format } from 'date-fns'

export interface OccupancyDay {
  date: string // formato yyyy-MM-dd
  reservations: {
    id: string
    guestName: string
    status: string
    checkIn: string // formato yyyy-MM-dd
    checkOut: string // formato yyyy-MM-dd
  }[]
}

export interface RoomOccupancy {
  room: {
    id: string
    number: string
    name: string
  }
  days: OccupancyDay[]
}

export async function getOccupancyGrid(
  startDate: Date,
  endDate: Date
): Promise<RoomOccupancy[]> {
  // Buscar todos os quartos
  const rooms = await prisma.room.findMany({
    where: {
      status: {
        not: 'maintenance',
      },
    },
    orderBy: {
      number: 'asc',
    },
    select: {
      id: true,
      number: true,
      name: true,
    },
  })

  // Gerar array de dias
  const days = eachDayOfInterval({
    start: startOfDay(startDate),
    end: endOfDay(endDate),
  })

  // Buscar todas as reservas no período
  const reservations = await prisma.reservation.findMany({
    where: {
      status: {
        not: 'cancelled',
      },
      OR: [
        {
          checkIn: {
            lte: endDate,
          },
          checkOut: {
            gte: startDate,
          },
        },
      ],
    },
    include: {
      guest: {
        select: {
          name: true,
        },
      },
      room: {
        select: {
          id: true,
        },
      },
    },
  })

  // Construir grade de ocupação
  const occupancyGrid: RoomOccupancy[] = rooms.map((room) => {
    const roomReservations = reservations.filter((r) => r.room.id === room.id)

    const daysOccupancy: OccupancyDay[] = days.map((day) => {
      const dayReservations = roomReservations.filter((reservation) => {
        const checkIn = startOfDay(reservation.checkIn)
        const checkOut = endOfDay(reservation.checkOut)
        const currentDay = startOfDay(day)

        return currentDay >= checkIn && currentDay < checkOut
      })

      return {
        date: format(day, 'yyyy-MM-dd'),
        reservations: dayReservations.map((r) => ({
          id: r.id,
          guestName: r.guest.name,
          status: r.status,
          checkIn: format(r.checkIn, 'yyyy-MM-dd'),
          checkOut: format(r.checkOut, 'yyyy-MM-dd'),
        })),
      }
    })

    return {
      room,
      days: daysOccupancy,
    }
  })

  return occupancyGrid
}

