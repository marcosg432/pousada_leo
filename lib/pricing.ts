// Helpers para cálculo de preços de reservas

export interface PricingBreakdown {
  basePrice: number      // Preço base (diária × noites)
  extraPrice: number     // Preço de pessoas extras
  totalPrice: number     // Total (base + extras)
  confirmationPrice: number // 50% do total para confirmação
  nights: number
  basePricePerNight: number
  extraPricePerPerson: number
}

/**
 * Calcula o preço total de uma reserva
 * @param basePricePerNight Preço base da diária (válido para até 2 pessoas)
 * @param nights Número de noites
 * @param adults Número de adultos
 * @param children Número de crianças (para compatibilidade, use childrenAges quando disponível)
 * @param extraPersonPrice Preço por pessoa extra por dia (padrão: R$ 50)
 * @param childrenAges Array com as idades das crianças (crianças até 5 anos não pagam)
 */
export function calculateReservationPrice(
  basePricePerNight: number,
  nights: number,
  adults: number = 2,
  children: number = 0,
  extraPersonPrice: number = 50,
  childrenAges: number[] = []
): PricingBreakdown {
  // Preço base (diária × noites)
  const basePrice = basePricePerNight * nights

  // Contar crianças que pagam (acima de 5 anos)
  const payingChildren = childrenAges.length > 0
    ? childrenAges.filter(age => age > 5).length
    : children // Se não houver idades, considerar todas as crianças como pagantes

  // Calcular pessoas extras (acima de 2)
  // Considera adultos + crianças que pagam (acima de 5 anos)
  const totalPayingPeople = adults + payingChildren
  const extraPeople = Math.max(0, totalPayingPeople - 2)

  // Preço de pessoas extras (por pessoa por dia)
  const extraPrice = extraPeople * extraPersonPrice * nights

  // Total
  const totalPrice = basePrice + extraPrice

  // Valor para confirmação (50%)
  const confirmationPrice = totalPrice * 0.5

  return {
    basePrice,
    extraPrice,
    totalPrice,
    confirmationPrice,
    nights,
    basePricePerNight,
    extraPricePerPerson: extraPersonPrice,
  }
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





