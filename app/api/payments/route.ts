import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reservationId = searchParams.get('reservationId')

    if (reservationId) {
      const payments = await prisma.payment.findMany({
        where: { reservationId },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(payments)
    }

    const payments = await prisma.payment.findMany({
      include: {
        reservation: {
          select: {
            id: true,
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
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pagamentos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validações básicas
    if (!data.reservationId || !data.amount || !data.method) {
      return NextResponse.json(
        { error: 'Dados incompletos. É necessário: reservationId, amount e method' },
        { status: 400 }
      )
    }

    if (data.amount <= 0) {
      return NextResponse.json(
        { error: 'O valor do pagamento deve ser maior que zero' },
        { status: 400 }
      )
    }

    // Buscar a reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: data.reservationId },
      include: {
        payments: {
          where: {
            status: 'completed',
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

    // Calcular valores atuais
    const currentPaidAmount = reservation.paidAmount || 0
    const totalAmount = reservation.totalPrice
    const minimumPayment = reservation.minimumPayment || totalAmount * 0.5
    const newPaidAmount = currentPaidAmount + data.amount

    // Validar se o pagamento mínimo foi atingido
    if (reservation.status === 'pending_payment' && newPaidAmount < minimumPayment) {
      return NextResponse.json(
        {
          error: `Para confirmar a reserva, é necessário pagar no mínimo ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(minimumPayment)}. Valor atual: ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(newPaidAmount)}`,
          minimumRequired: minimumPayment,
          currentPaid: newPaidAmount,
        },
        { status: 400 }
      )
    }

    // Validar se não está pagando mais que o total
    if (newPaidAmount > totalAmount) {
      return NextResponse.json(
        {
          error: `O valor pago não pode exceder o valor total da reserva. Total: ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalAmount)}`,
        },
        { status: 400 }
      )
    }

    // Criar o pagamento
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        method: data.method,
        status: data.status || 'completed', // Se não especificar, assume como pago
        transactionId: data.transactionId || null,
        paidAt: data.status === 'completed' ? new Date() : null,
        notes: data.notes || null,
        reservationId: data.reservationId,
      },
    })

    // Atualizar valores da reserva
    const paidPercentage = (newPaidAmount / totalAmount) * 100
    const remainingAmount = totalAmount - newPaidAmount

    // Determinar novo status
    let newStatus = reservation.status
    if (reservation.status === 'pending_payment' && newPaidAmount >= minimumPayment) {
      newStatus = 'confirmed'
    }

    // Atualizar reserva
    await prisma.reservation.update({
      where: { id: data.reservationId },
      data: {
        paidAmount: newPaidAmount,
        paidPercentage: Math.round(paidPercentage * 100) / 100, // 2 casas decimais
        remainingAmount: remainingAmount,
        status: newStatus,
      },
    })

    // Disparar mensagem de pagamento confirmado se status mudou para confirmed
    if (newStatus === 'confirmed' && reservation.status !== 'confirmed') {
      try {
        const { onPaymentConfirmed } = await import('@/lib/message-service')
        await onPaymentConfirmed(data.reservationId)
      } catch (error) {
        console.error('Erro ao enviar mensagem de pagamento confirmado:', error)
        // Não falha o pagamento se o envio de mensagem falhar
      }
    }

    // Buscar reserva atualizada para retornar
    const updatedReservation = await prisma.reservation.findUnique({
      where: { id: data.reservationId },
      include: {
        payments: {
          where: {
            status: 'completed',
          },
          orderBy: { createdAt: 'desc' },
        },
        guest: {
          select: {
            name: true,
            email: true,
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
    })

    return NextResponse.json(
      {
        payment,
        reservation: updatedReservation,
        message: newStatus === 'confirmed' 
          ? 'Reserva confirmada com sucesso!' 
          : 'Pagamento registrado. Aguardando pagamento mínimo para confirmação.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar pagamento' },
      { status: 500 }
    )
  }
}


