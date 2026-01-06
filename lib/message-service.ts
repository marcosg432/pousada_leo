// Serviço centralizado para envio de mensagens
// Gerencia histórico e dispara mensagens automaticamente

import { prisma } from './prisma'
import { sendReservationMessage, MessageType } from './email-service'
import { MessageVariables } from './message-templates'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

/**
 * Formata valores monetários
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Prepara variáveis da mensagem a partir da reserva
 */
async function prepareMessageVariables(reservationId: string): Promise<MessageVariables | null> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      guest: true,
      room: true,
    },
  })

  if (!reservation) {
    return null
  }

  const totalPeople = reservation.adults + reservation.children
  const peopleText = `${totalPeople} ${totalPeople === 1 ? 'pessoa' : 'pessoas'}`

  return {
    NOME: reservation.guest.name,
    CHECKIN: format(new Date(reservation.checkIn), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    CHECKOUT: format(new Date(reservation.checkOut), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    QUARTO: `${reservation.room.name} (${reservation.room.number})`,
    PESSOAS: peopleText,
    TOTAL: formatCurrency(reservation.totalPrice),
    MINIMO: formatCurrency(reservation.minimumPayment),
    VALOR_PAGO: formatCurrency(reservation.paidAmount),
    RESTANTE: formatCurrency(reservation.remainingAmount),
  }
}

/**
 * Envia mensagem e registra no histórico
 */
export async function sendAndLogMessage(
  reservationId: string,
  type: MessageType,
  channel: 'email' | 'whatsapp' = 'email'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Buscar dados da reserva
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        guest: true,
        room: true,
      },
    })

    if (!reservation) {
      return { success: false, error: 'Reserva não encontrada' }
    }

    // Verificar se tem e-mail
    if (channel === 'email' && !reservation.guest.email) {
      return { success: false, error: 'Hóspede não possui e-mail cadastrado' }
    }

    // Preparar variáveis
    const vars = await prepareMessageVariables(reservationId)
    if (!vars) {
      return { success: false, error: 'Erro ao preparar variáveis da mensagem' }
    }

    // Enviar mensagem
    const recipient = channel === 'email' 
      ? reservation.guest.email! 
      : reservation.guest.phone

    let sendResult: { success: boolean; error?: string }
    
    if (channel === 'email') {
      sendResult = await sendReservationMessage(type, vars, recipient)
    } else {
      // TODO: Implementar envio via WhatsApp
      sendResult = { success: false, error: 'WhatsApp ainda não implementado' }
    }

    // Obter template para salvar conteúdo completo
    const { getMessageTemplate } = await import('./message-templates')
    const template = getMessageTemplate(type, vars)

    // Registrar no histórico
    const messageHistory = await prisma.messageHistory.create({
      data: {
        type,
        channel,
        status: sendResult.success ? 'sent' : 'failed',
        recipient,
        subject: channel === 'email' ? template.subject : null,
        content: template.content,
        errorMessage: sendResult.error || null,
        reservationId,
      },
    })

    return {
      success: sendResult.success,
      messageId: messageHistory.id,
      error: sendResult.error,
    }
  } catch (error: any) {
    console.error('Erro ao enviar e registrar mensagem:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
    }
  }
}

/**
 * Dispara mensagem quando reserva é criada
 */
export async function onReservationCreated(reservationId: string): Promise<void> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { guest: true },
  })

  if (!reservation || reservation.status !== 'pending_payment') {
    return
  }

  // Só envia se for do site (reservas do admin podem não ter e-mail)
  if (reservation.source === 'site' && reservation.guest.email) {
    await sendAndLogMessage(reservationId, 'reservation_created', 'email')
  }
}

/**
 * Dispara mensagem quando pagamento é confirmado (≥50%)
 */
export async function onPaymentConfirmed(reservationId: string): Promise<void> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { guest: true },
  })

  if (!reservation || reservation.status !== 'confirmed') {
    return
  }

  // Verificar se já foi enviada mensagem de confirmação
  const existingMessage = await prisma.messageHistory.findFirst({
    where: {
      reservationId,
      type: { in: ['payment_confirmed', 'reservation_confirmed'] },
      status: 'sent',
    },
  })

  if (existingMessage) {
    return // Já foi enviada
  }

  if (reservation.guest.email) {
    await sendAndLogMessage(reservationId, 'payment_confirmed', 'email')
  }
}

/**
 * Dispara mensagem quando check-in é realizado
 */
export async function onCheckinCompleted(reservationId: string): Promise<void> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { guest: true },
  })

  if (!reservation || reservation.status !== 'checked_in') {
    return
  }

  if (reservation.guest.email) {
    await sendAndLogMessage(reservationId, 'checkin_completed', 'email')
  }
}

/**
 * Dispara mensagem quando reserva é cancelada
 */
export async function onReservationCancelled(reservationId: string): Promise<void> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { guest: true },
  })

  if (!reservation || reservation.status !== 'cancelled') {
    return
  }

  if (reservation.guest.email) {
    await sendAndLogMessage(reservationId, 'reservation_cancelled', 'email')
  }
}

