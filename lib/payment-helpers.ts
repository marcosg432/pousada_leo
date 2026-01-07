// Helpers para cálculos e validações de pagamento

export interface PaymentCalculation {
  totalAmount: number
  minimumPayment: number
  paidAmount: number
  paidPercentage: number
  remainingAmount: number
}

/**
 * Calcula os valores de pagamento para uma reserva
 */
export function calculatePaymentValues(
  totalAmount: number,
  paidAmount: number = 0
): PaymentCalculation {
  const minimumPayment = totalAmount * 0.5
  const paidPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
  const remainingAmount = totalAmount - paidAmount

  return {
    totalAmount,
    minimumPayment,
    paidAmount,
    paidPercentage: Math.round(paidPercentage * 100) / 100, // 2 casas decimais
    remainingAmount: Math.round(remainingAmount * 100) / 100,
  }
}

/**
 * Valida se um pagamento atende ao mínimo necessário
 */
export function validatePayment(
  paymentAmount: number,
  totalAmount: number,
  currentPaidAmount: number = 0
): { valid: boolean; error?: string; minimumRequired?: number } {
  if (paymentAmount <= 0) {
    return {
      valid: false,
      error: 'O valor do pagamento deve ser maior que zero',
    }
  }

  const minimumPayment = totalAmount * 0.5
  const newPaidAmount = currentPaidAmount + paymentAmount

  if (newPaidAmount > totalAmount) {
    return {
      valid: false,
      error: `O valor pago não pode exceder o valor total da reserva (R$ ${totalAmount.toFixed(2)})`,
    }
  }

  // Se ainda não atingiu o mínimo, verificar se este pagamento é suficiente
  if (currentPaidAmount < minimumPayment && newPaidAmount < minimumPayment) {
    return {
      valid: false,
      error: `Para confirmar a reserva, é necessário pagar no mínimo R$ ${minimumPayment.toFixed(2)}. Você já pagou R$ ${currentPaidAmount.toFixed(2)}.`,
      minimumRequired: minimumPayment,
    }
  }

  return { valid: true }
}

/**
 * Determina o status da reserva baseado no pagamento
 */
export function getReservationStatusFromPayment(
  currentStatus: string,
  paidAmount: number,
  minimumPayment: number
): string {
  // Se já está confirmada ou em status posterior, manter
  if (['confirmed', 'checked_in', 'checked_out'].includes(currentStatus)) {
    return currentStatus
  }

  // Se está cancelada, manter cancelada
  if (currentStatus === 'cancelled') {
    return 'cancelled'
  }

  // Se atingiu o mínimo, confirmar
  if (paidAmount >= minimumPayment) {
    return 'confirmed'
  }

  // Caso contrário, aguardando pagamento
  return 'pending_payment'
}

/**
 * Formata valor monetário brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}




