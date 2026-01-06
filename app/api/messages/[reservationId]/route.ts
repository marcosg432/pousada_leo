import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAndLogMessage } from '@/lib/message-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const { reservationId } = await params
    const messages = await prisma.messageHistory.findMany({
      where: { reservationId },
      orderBy: { sentAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const data = await request.json()
    const { type, channel } = data

    if (!type) {
      return NextResponse.json(
        { error: 'Tipo de mensagem é obrigatório' },
        { status: 400 }
      )
    }

    const validTypes = [
      'reservation_created',
      'payment_confirmed',
      'reservation_confirmed',
      'checkin_reminder',
      'checkin_completed',
      'reservation_cancelled',
    ]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de mensagem inválido' },
        { status: 400 }
      )
    }

    const { reservationId } = await params
    const result = await sendAndLogMessage(
      reservationId,
      type as any,
      (channel || 'email') as 'email' | 'whatsapp'
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Mensagem enviada com sucesso',
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}

