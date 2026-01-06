// Helpers para calcular taxas de ocupação

import { prisma } from './prisma'
import { startOfMonth, endOfMonth, startOfDay, endOfDay, differenceInDays } from 'date-fns'

export interface OccupancyStats {
  period: {
    start: Date
    end: Date
  }
  totalRooms: number
  availableRooms: number
  occupiedRooms: number
  blockedRooms: number
  totalNights: number
  soldNights: number
  occupancyRate: number // Percentual
  revenue: number
}

/**
 * Calcula estatísticas de ocupação para um período
 */
export async function getOccupancyStats(
  startDate: Date,
  endDate: Date
): Promise<OccupancyStats> {
  const periodStart = startOfDay(startDate)
  const periodEnd = endOfDay(endDate)
  const totalDays = differenceInDays(periodEnd, periodStart) + 1

  // Total de quartos
  const totalRooms = await prisma.room.count({
    where: {
      status: 'available',
    },
  })

  // Buscar todas as reservas confirmadas no período
  const reservations = await prisma.reservation.findMany({
    where: {
      status: {
        in: ['confirmed', 'checked_in', 'checked_out'],
      },
      AND: [
        {
          checkIn: {
            lte: periodEnd,
          },
        },
        {
          checkOut: {
            gte: periodStart,
          },
        },
      ],
    },
    include: {
      room: true,
    },
  })

  // Calcular noites vendidas
  let soldNights = 0
  let revenue = 0

  for (const reservation of reservations) {
    // Calcular noites dentro do período
    const checkIn = reservation.checkIn > periodStart ? reservation.checkIn : periodStart
    const checkOut = reservation.checkOut < periodEnd ? reservation.checkOut : periodEnd
    const nights = differenceInDays(checkOut, checkIn)
    
    soldNights += nights
    revenue += reservation.totalPrice
  }

  // Buscar bloqueios no período
  const blockages = await prisma.roomBlockage.findMany({
    where: {
      AND: [
        {
          startDate: {
            lte: periodEnd,
          },
        },
        {
          endDate: {
            gte: periodStart,
          },
        },
      ],
    },
  })

  // Calcular quartos ocupados (último dia do período)
  const occupiedReservations = await prisma.reservation.findMany({
    where: {
      status: {
        in: ['confirmed', 'checked_in'],
      },
      AND: [
        {
          checkIn: {
            lte: periodEnd,
          },
        },
        {
          checkOut: {
            gt: periodEnd,
          },
        },
      ],
    },
    select: {
      roomId: true,
    },
  })
  const occupiedRooms = new Set(occupiedReservations.map(r => r.roomId)).size

  // Calcular quartos bloqueados (último dia do período)
  const blockedRoomBlockages = await prisma.roomBlockage.findMany({
    where: {
      AND: [
        {
          startDate: {
            lte: periodEnd,
          },
        },
        {
          endDate: {
            gt: periodEnd,
          },
        },
      ],
    },
    select: {
      roomId: true,
    },
  })
  const blockedRooms = new Set(blockedRoomBlockages.map(b => b.roomId)).size

  const availableRooms = totalRooms - occupiedRooms - blockedRooms

  // Taxa de ocupação = (noites vendidas / noites totais disponíveis) × 100
  const totalNights = totalRooms * totalDays
  const occupancyRate = totalNights > 0 
    ? (soldNights / totalNights) * 100 
    : 0

  return {
    period: {
      start: periodStart,
      end: periodEnd,
    },
    totalRooms,
    availableRooms,
    occupiedRooms,
    blockedRooms,
    totalNights,
    soldNights,
    occupancyRate: Math.round(occupancyRate * 100) / 100, // 2 casas decimais
    revenue,
  }
}

/**
 * Calcula estatísticas de ocupação mensal
 */
export async function getMonthlyOccupancyStats(
  year: number,
  month: number
): Promise<OccupancyStats> {
  const start = startOfMonth(new Date(year, month - 1, 1))
  const end = endOfMonth(new Date(year, month - 1, 1))
  
  return getOccupancyStats(start, end)
}



