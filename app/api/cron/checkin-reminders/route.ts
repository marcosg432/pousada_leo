import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAndLogMessage } from '@/lib/message-service'
import { startOfDay, addDays, isAfter, isBefore } from 'date-fns'

/**
 * Job para enviar lembretes de check-in
 * Deve ser executado diariamente (via cron ou agendador)
 * Envia lembretes 1 ou 2 dias antes do check-in
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é uma chamada autorizada (proteção básica)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const today = startOfDay(new Date())
    const tomorrow = addDays(today, 1)
    const dayAfterTomorrow = addDays(today, 2)

    // Buscar reservas confirmadas com check-in em 1 ou 2 dias
    const reservations = await prisma.reservation.findMany({
      where: {
        status: {
          in: ['confirmed', 'pending_payment'], // Incluir pending_payment caso tenha sido confirmada depois
        },
        checkIn: {
          gte: tomorrow,
          lte: dayAfterTomorrow,
        },
      },
      include: {
        guest: {
          select: {
            email: true,
          },
        },
        messages: {
          where: {
            type: 'checkin_reminder',
            status: 'sent',
          },
        },
      },
    })

    let sentCount = 0
    let errorCount = 0

    for (const reservation of reservations) {
      // Verificar se já foi enviado lembrete
      if (reservation.messages.length > 0) {
        continue
      }

      // Verificar se tem e-mail
      if (!reservation.guest.email) {
        continue
      }

      try {
        const result = await sendAndLogMessage(
          reservation.id,
          'checkin_reminder',
          'email'
        )

        if (result.success) {
          sentCount++
        } else {
          errorCount++
          console.error(`Erro ao enviar lembrete para reserva ${reservation.id}:`, result.error)
        }
      } catch (error) {
        errorCount++
        console.error(`Erro ao processar lembrete para reserva ${reservation.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      processed: reservations.length,
      sent: sentCount,
      errors: errorCount,
      message: `Processadas ${reservations.length} reservas. ${sentCount} lembretes enviados.`,
    })
  } catch (error) {
    console.error('Erro ao processar lembretes de check-in:', error)
    return NextResponse.json(
      { error: 'Erro ao processar lembretes' },
      { status: 500 }
    )
  }
}

