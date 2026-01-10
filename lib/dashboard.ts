// Helpers para dashboard - consultas otimizadas

import { prisma } from './prisma'
import { startOfDay, endOfDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

export async function getDashboardStats() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // Reservas do dia (não canceladas)
  const reservationsToday = await prisma.reservation.count({
    where: {
      status: {
        not: 'cancelled', // Não contar reservas canceladas
      },
      OR: [
        {
          checkIn: {
            lte: todayEnd,
            gte: todayStart,
          },
        },
        {
          checkOut: {
            lte: todayEnd,
            gte: todayStart,
          },
        },
        {
          AND: [
            { checkIn: { lte: todayStart } },
            { checkOut: { gte: todayEnd } },
          ],
        },
      ],
    },
  })

  // Reservas do mês (não canceladas)
  const reservationsMonth = await prisma.reservation.count({
    where: {
      status: {
        not: 'cancelled', // Não contar reservas canceladas
      },
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })

  // Novas reservas do site (aguardando pagamento)
  const newSiteReservations = await prisma.reservation.count({
    where: {
      source: 'site',
      status: 'pending_payment',
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })

  // Total de quartos
  const totalRooms = await prisma.room.count()

  // Quartos ocupados hoje (usar findMany com distinct e depois contar)
  const occupiedReservations = await prisma.reservation.findMany({
    where: {
      status: {
        in: ['confirmed', 'checked_in'],
      },
      checkIn: {
        lte: todayEnd,
      },
      checkOut: {
        gte: todayStart,
      },
    },
    select: {
      roomId: true,
    },
    distinct: ['roomId'],
  })
  
  const occupiedRooms = occupiedReservations.length

  // Taxa de ocupação
  const occupancyRate = totalRooms > 0 
    ? Math.round((occupiedRooms / totalRooms) * 100) 
    : 0

  // Faturamento do mês - considera reservas confirmadas/check-in/check-out
  // que têm check-in ou check-out no mês atual
  const monthlyRevenue = await prisma.reservation.aggregate({
    where: {
      status: {
        in: ['confirmed', 'checked_in', 'checked_out'],
      },
      OR: [
        {
          // Check-in no mês atual
          checkIn: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        {
          // Check-out no mês atual
          checkOut: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        {
          // Reserva que abrange o mês atual
          AND: [
            { checkIn: { lte: monthStart } },
            { checkOut: { gte: monthEnd } },
          ],
      },
      ],
    },
    _sum: {
      totalPrice: true,
    },
  })

  const revenue = monthlyRevenue._sum.totalPrice || 0

  // Total recebido (pagamentos completos)
  const totalReceived = await prisma.reservation.aggregate({
    where: {
      OR: [
        {
          checkIn: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        {
          checkOut: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        {
          AND: [
            { checkIn: { lte: monthStart } },
            { checkOut: { gte: monthEnd } },
          ],
        },
      ],
      status: {
        not: 'cancelled',
      },
    },
    _sum: {
      paidAmount: true,
    },
  })

  const received = totalReceived._sum.paidAmount || 0

  // Total pendente de pagamento
  const totalPending = await prisma.reservation.aggregate({
    where: {
      OR: [
        {
          checkIn: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        {
          checkOut: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        {
          AND: [
            { checkIn: { lte: monthStart } },
            { checkOut: { gte: monthEnd } },
          ],
        },
      ],
      status: {
        not: 'cancelled',
      },
    },
    _sum: {
      remainingAmount: true,
    },
  })

  const pending = totalPending._sum.remainingAmount || 0

  // Reservas aguardando pagamento
  const pendingPaymentCount = await prisma.reservation.count({
    where: {
      status: 'pending_payment',
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })

  // Reservas confirmadas
  const confirmedCount = await prisma.reservation.count({
    where: {
      status: 'confirmed',
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })

  return {
    reservationsToday,
    reservationsMonth,
    occupancyRate,
    totalRooms,
    occupiedRooms,
    revenue,
    received, // Total recebido
    pending, // Total pendente
    pendingPaymentCount, // Quantidade de reservas aguardando pagamento
    confirmedCount, // Quantidade de reservas confirmadas
    newSiteReservations,
  }
}

export async function getRecentReservations(limit = 5) {
  const reservations = await prisma.reservation.findMany({
    where: {
      status: {
        not: 'cancelled', // Não mostrar reservas canceladas no dashboard
      },
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      guest: {
        select: {
          name: true,
        },
      },
      room: {
        select: {
          number: true,
        },
      },
    },
  })

  return reservations.map((r) => ({
    id: r.id,
    guest: r.guest.name,
    room: r.room.number,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    status: r.status,
  }))
}

export async function getTodayReservations() {
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  const reservations = await prisma.reservation.findMany({
    where: {
      status: {
        not: 'cancelled', // Não mostrar reservas canceladas no dashboard
      },
      OR: [
        {
          checkIn: {
            lte: todayEnd,
            gte: todayStart,
          },
        },
        {
          checkOut: {
            lte: todayEnd,
            gte: todayStart,
          },
        },
        {
          AND: [
            { checkIn: { lte: todayStart } },
            { checkOut: { gte: todayEnd } },
          ],
        },
      ],
    },
    include: {
      guest: {
        select: {
          name: true,
          phone: true,
        },
      },
      room: {
        select: {
          number: true,
          name: true,
        },
      },
    },
    orderBy: {
      checkIn: 'asc',
    },
  })

  return reservations
}

