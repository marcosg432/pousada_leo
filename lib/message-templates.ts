// Templates centralizados de mensagens
// Todos os textos devem ser exatamente como especificado

export type MessageType =
  | 'reservation_created'
  | 'payment_confirmed'
  | 'reservation_confirmed'
  | 'checkin_reminder'
  | 'checkin_completed'
  | 'reservation_cancelled'

export interface MessageVariables {
  NOME: string
  CHECKIN: string
  CHECKOUT: string
  QUARTO: string
  PESSOAS: string
  TOTAL: string
  MINIMO: string
  VALOR_PAGO?: string
  RESTANTE?: string
}

/**
 * Template 1: Reserva criada (aguardando pagamento)
 */
export function getReservationCreatedMessage(vars: MessageVariables): { subject: string; content: string } {
  return {
    subject: 'Solicitação de Reserva - Pousada do Leô',
    content: `Olá, ${vars.NOME} 😊

Recebemos sua solicitação de reserva na Pousada do Leô.

📅 Datas: ${vars.CHECKIN} até ${vars.CHECKOUT}
🛏️ Quarto: ${vars.QUARTO}
👥 Pessoas: ${vars.PESSOAS}
💰 Valor total: R$ ${vars.TOTAL}
🔐 Valor mínimo para confirmação (50%): R$ ${vars.MINIMO}

Para garantir a reserva, é necessário o pagamento mínimo de 50%.
Enquanto o pagamento não for realizado, a reserva poderá ser cancelada automaticamente.

Qualquer dúvida, estamos à disposição.`,
  }
}

/**
 * Template 2: Pagamento parcial recebido (confirmação)
 */
export function getPaymentConfirmedMessage(vars: MessageVariables): { subject: string; content: string } {
  return {
    subject: 'Reserva Confirmada - Pousada do Leô',
    content: `Olá, ${vars.NOME}! 🎉

Confirmamos o recebimento do pagamento de R$ ${vars.VALOR_PAGO} referente à sua reserva.

✅ Sua reserva está CONFIRMADA!

📅 Datas: ${vars.CHECKIN} até ${vars.CHECKOUT}
🛏️ Quarto: ${vars.QUARTO}
💰 Valor total: R$ ${vars.TOTAL}
💳 Valor pago: R$ ${vars.VALOR_PAGO}
💵 Valor restante: R$ ${vars.RESTANTE}

🕑 Check-in: a partir das 14h
🕛 Check-out: até meio-dia

O restante do pagamento deverá ser feito no check-in, via Pix, cartão ou dinheiro.

Agradecemos a preferência!
Pousada do Leô 🌿`,
  }
}

/**
 * Template 3: Lembrete pré check-in
 */
export function getCheckinReminderMessage(vars: MessageVariables): { subject: string; content: string } {
  return {
    subject: 'Lembrete de Check-in - Pousada do Leô',
    content: `Olá, ${vars.NOME}! 😊

Sua hospedagem na Pousada do Leô está chegando!

📅 Check-in: ${vars.CHECKIN} a partir das 14h
💵 Valor restante a pagar no check-in: R$ ${vars.RESTANTE}

⚠️ Lembretes importantes:
- Não é permitido fumar nos quartos
- Não oferecemos café da manhã
- Check-out até meio-dia

Estamos à disposição para qualquer dúvida.
Até breve!`,
  }
}

/**
 * Template 4: Check-in realizado
 */
export function getCheckinCompletedMessage(vars: MessageVariables): { subject: string; content: string } {
  return {
    subject: 'Bem-vindo(a) à Pousada do Leô',
    content: `Seja bem-vindo(a), ${vars.NOME}! 🏡

Seu check-in na Pousada do Leô foi realizado com sucesso.

Desejamos uma excelente estadia!
Qualquer necessidade, é só nos chamar.`,
  }
}

/**
 * Template 5: Cancelamento de reserva
 */
export function getReservationCancelledMessage(vars: MessageVariables): { subject: string; content: string } {
  return {
    subject: 'Cancelamento de Reserva - Pousada do Leô',
    content: `Olá, ${vars.NOME}.

Sua reserva na Pousada do Leô foi cancelada.

Caso o cancelamento esteja dentro do prazo reembolsável, o valor será devolvido conforme as regras da hospedagem.

Ficamos à disposição.`,
  }
}

/**
 * Função auxiliar para obter template por tipo
 */
export function getMessageTemplate(
  type: MessageType,
  vars: MessageVariables
): { subject: string; content: string } {
  switch (type) {
    case 'reservation_created':
      return getReservationCreatedMessage(vars)
    case 'payment_confirmed':
    case 'reservation_confirmed':
      return getPaymentConfirmedMessage(vars)
    case 'checkin_reminder':
      return getCheckinReminderMessage(vars)
    case 'checkin_completed':
      return getCheckinCompletedMessage(vars)
    case 'reservation_cancelled':
      return getReservationCancelledMessage(vars)
    default:
      throw new Error(`Tipo de mensagem desconhecido: ${type}`)
  }
}



