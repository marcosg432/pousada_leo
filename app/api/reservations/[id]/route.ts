import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        room: {
          select: {
            id: true,
            number: true,
            name: true,
            description: true,
            capacity: true,
            price: true,
            type: true,
            amenities: true,
            images: true,
            status: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            document: true,
            address: true,
            notes: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        messages: {
          orderBy: {
            sentAt: 'desc',
          },
        },
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar reserva' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    // Validar status se fornecido
    const validStatuses = ['pending', 'pending_payment', 'confirmed', 'checked_in', 'checked_out', 'cancelled']
    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (data.status !== undefined) {
      updateData.status = data.status
      
      // Se cancelar, adicionar data de cancelamento
      if (data.status === 'cancelled') {
        updateData.cancelledAt = new Date()
        if (data.cancelledReason) {
          updateData.cancelledReason = data.cancelledReason
        }
      } else {
        // Se mudar de cancelado para outro status, limpar dados de cancelamento
        updateData.cancelledAt = null
        updateData.cancelledReason = null
      }
    }

    if (data.checkIn !== undefined) {
      updateData.checkIn = new Date(data.checkIn)
    }

    if (data.checkOut !== undefined) {
      updateData.checkOut = new Date(data.checkOut)
    }

    if (data.adults !== undefined) {
      updateData.adults = data.adults
    }

    if (data.children !== undefined) {
      updateData.children = data.children
    }

    if (data.totalPrice !== undefined) {
      updateData.totalPrice = data.totalPrice
    }

    if (data.basePrice !== undefined) {
      updateData.basePrice = data.basePrice
    }

    if (data.extraPrice !== undefined) {
      updateData.extraPrice = data.extraPrice
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }

    // Buscar reserva atual para comparar status
    const currentReservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      select: { status: true },
    })

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: updateData,
      include: {
        room: {
          select: {
            id: true,
            number: true,
            name: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: true,
      },
    })

    // Disparar mensagens baseado em mudanças de status
    if (data.status && currentReservation && currentReservation.status !== data.status) {
      try {
        const { onCheckinCompleted, onReservationCancelled } = await import('@/lib/message-service')
        
        if (data.status === 'checked_in') {
          await onCheckinCompleted(params.id)
        } else if (data.status === 'cancelled') {
          await onReservationCancelled(params.id)
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem de mudança de status:', error)
        // Não falha a atualização se o envio de mensagem falhar
      }
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar reserva' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se a reserva existe
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        payments: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se há pagamentos completos (não permitir deletar se houver pagamentos)
    const completedPayments = reservation.payments.filter(
      (p) => p.status === 'completed'
    )

    if (completedPayments.length > 0) {
      return NextResponse.json(
        {
          error:
            'Não é possível deletar reserva com pagamentos confirmados. Cancele a reserva primeiro.',
        },
        { status: 400 }
      )
    }

    // Deletar pagamentos pendentes primeiro (cascade)
    await prisma.payment.deleteMany({
      where: {
        reservationId: params.id,
      },
    })

    // Deletar a reserva
    await prisma.reservation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Reserva deletada com sucesso' })
  } catch (error) {
    console.error('Error deleting reservation:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar reserva' },
      { status: 500 }
    )
  }
}

