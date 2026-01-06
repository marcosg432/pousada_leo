// Helpers para verificar disponibilidade de quartos

import { prisma } from './prisma'
import { startOfDay } from 'date-fns'
import { applyCheckInTime, applyCheckOutTime } from './checkin-checkout'

export async function getAvailableRooms(checkIn: Date, checkOut: Date) {
  // Aplicar horários corretos: check-in às 14h, check-out às 12h
  // Normalizar as datas de entrada para comparação
  const requestedCheckIn = applyCheckInTime(startOfDay(checkIn))
  const requestedCheckOut = applyCheckOutTime(startOfDay(checkOut))

  // Buscar todos os quartos disponíveis (status = available)
  const allRooms = await prisma.room.findMany({
    where: {
      status: 'available',
    },
    orderBy: {
      number: 'asc',
    },
  })

  // Buscar reservas que conflitam com o período
  // Uma reserva conflita se:
  // - Ela começa antes do nosso check-out E termina depois do nosso check-in
  // Considerando que check-out é às 12h e check-in é às 14h do mesmo dia
  // Reservas pending_payment também ocupam o quarto (bloqueiam a disponibilidade)
  const conflictingReservations = await prisma.reservation.findMany({
    where: {
      status: {
        not: 'cancelled', // Excluir apenas canceladas
      },
      AND: [
        {
          checkIn: {
            lt: requestedCheckOut, // Reserva existente começa antes do nosso check-out
          },
        },
        {
          checkOut: {
            gt: requestedCheckIn, // Reserva existente termina depois do nosso check-in
          },
        },
      ],
    },
    select: {
      roomId: true,
    },
  })

  // Buscar bloqueios que conflitam com o período
  // Bloqueios usam datas normalizadas (início do dia)
  const conflictingBlockages = await prisma.roomBlockage.findMany({
    where: {
      AND: [
        {
          startDate: {
            lte: startOfDay(checkOut), // Bloqueio começa antes ou no nosso check-out
          },
        },
        {
          endDate: {
            gte: startOfDay(checkIn), // Bloqueio termina depois ou no nosso check-in
          },
        },
      ],
    },
    select: {
      roomId: true,
    },
  })

  // IDs dos quartos ocupados ou bloqueados
  const occupiedRoomIds = new Set(
    conflictingReservations.map((r) => r.roomId)
  )
  const blockedRoomIds = new Set(
    conflictingBlockages.map((b) => b.roomId)
  )

  // Filtrar quartos disponíveis (não ocupados e não bloqueados)
  const availableRooms = allRooms.filter(
    (room) => !occupiedRoomIds.has(room.id) && !blockedRoomIds.has(room.id)
  )

  return availableRooms
}

export async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  // Verificar se o quarto existe e está disponível
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  })

  if (!room || room.status !== 'available') {
    return false
  }

  // Aplicar horários corretos: check-in às 14h, check-out às 12h
  const requestedCheckIn = applyCheckInTime(startOfDay(checkIn))
  const requestedCheckOut = applyCheckOutTime(startOfDay(checkOut))

  // Verificar se há conflito com reservas
  // Uma reserva conflita se ela ocupa o quarto durante nosso período
  // Reservas pending_payment também ocupam o quarto (bloqueiam a disponibilidade)
  const conflictingReservation = await prisma.reservation.findFirst({
    where: {
      roomId,
      status: {
        not: 'cancelled', // Excluir apenas canceladas
      },
      AND: [
        {
          checkIn: {
            lt: requestedCheckOut, // Reserva existente começa antes do nosso check-out
          },
        },
        {
          checkOut: {
            gt: requestedCheckIn, // Reserva existente termina depois do nosso check-in
          },
        },
      ],
    },
    select: {
      id: true, // Apenas selecionar o ID para verificar existência
    },
  })

  if (conflictingReservation) {
    return false
  }

  // Verificar se há conflito com bloqueios
  // Bloqueios usam datas normalizadas (início do dia)
  const conflictingBlockage = await prisma.roomBlockage.findFirst({
    where: {
      roomId,
      AND: [
        {
          startDate: {
            lte: startOfDay(checkOut), // Bloqueio começa antes ou no nosso check-out
          },
        },
        {
          endDate: {
            gte: startOfDay(checkIn), // Bloqueio termina depois ou no nosso check-in
          },
        },
      ],
    },
  })

  return !conflictingBlockage
}

