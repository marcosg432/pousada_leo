// Helpers para manipulação e validação de datas
import { startOfDay, isBefore, isSameDay, parse, format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

/**
 * Normaliza uma data para o início do dia (00:00:00)
 */
export function normalizeDate(date: Date): Date {
  return startOfDay(date)
}

/**
 * Obtém a data atual normalizada (início do dia)
 */
export function getTodayNormalized(): Date {
  return normalizeDate(new Date())
}

/**
 * Converte string DD/MM/YYYY para Date
 */
export function parseBrazilianDate(dateString: string): Date | null {
  try {
    // Remove espaços e caracteres especiais
    const cleaned = dateString.replace(/\s/g, '')
    
    // Tenta parsear no formato brasileiro
    const parsed = parse(cleaned, 'dd/MM/yyyy', new Date(), { locale: ptBR })
    
    // Verifica se a data é válida
    if (isNaN(parsed.getTime())) {
      return null
    }
    
    return normalizeDate(parsed)
  } catch {
    return null
  }
}

/**
 * Converte string YYYY-MM-DD (input type="date") para Date normalizada
 */
export function parseISODate(dateString: string): Date | null {
  try {
    if (!dateString) return null
    
    // O input type="date" retorna YYYY-MM-DD
    const date = new Date(dateString + 'T00:00:00')
    
    if (isNaN(date.getTime())) {
      return null
    }
    
    return normalizeDate(date)
  } catch {
    return null
  }
}

/**
 * Valida se check-in não é no passado
 */
export function validateCheckIn(checkIn: Date): { valid: boolean; error?: string } {
  const today = getTodayNormalized()
  const checkInNormalized = normalizeDate(checkIn)
  
  if (isBefore(checkInNormalized, today)) {
    return {
      valid: false,
      error: 'Data de check-in não pode ser no passado',
    }
  }
  
  return { valid: true }
}

/**
 * Valida se check-out é posterior ao check-in
 */
export function validateCheckOut(
  checkIn: Date,
  checkOut: Date
): { valid: boolean; error?: string } {
  const checkInNormalized = normalizeDate(checkIn)
  const checkOutNormalized = normalizeDate(checkOut)
  
  if (isBefore(checkOutNormalized, checkInNormalized) || 
      isSameDay(checkOutNormalized, checkInNormalized)) {
    return {
      valid: false,
      error: 'Data de check-out deve ser posterior à data de check-in',
    }
  }
  
  return { valid: true }
}

/**
 * Valida ambas as datas
 */
export function validateDates(
  checkIn: Date | string | null,
  checkOut: Date | string | null
): { valid: boolean; error?: string; checkInDate?: Date; checkOutDate?: Date } {
  if (!checkIn || !checkOut) {
    return {
      valid: false,
      error: 'Selecione datas válidas para verificar disponibilidade',
    }
  }

  // Converter para Date se necessário
  let checkInDate: Date
  let checkOutDate: Date

  if (typeof checkIn === 'string') {
    const parsed = parseISODate(checkIn)
    if (!parsed) {
      return {
        valid: false,
        error: 'Data de check-in inválida',
      }
    }
    checkInDate = parsed
  } else {
    checkInDate = normalizeDate(checkIn)
  }

  if (typeof checkOut === 'string') {
    const parsed = parseISODate(checkOut)
    if (!parsed) {
      return {
        valid: false,
        error: 'Data de check-out inválida',
      }
    }
    checkOutDate = parsed
  } else {
    checkOutDate = normalizeDate(checkOut)
  }

  // Validar check-in
  const checkInValidation = validateCheckIn(checkInDate)
  if (!checkInValidation.valid) {
    return {
      valid: false,
      error: checkInValidation.error,
    }
  }

  // Validar check-out
  const checkOutValidation = validateCheckOut(checkInDate, checkOutDate)
  if (!checkOutValidation.valid) {
    return {
      valid: false,
      error: checkOutValidation.error,
    }
  }

  return {
    valid: true,
    checkInDate,
    checkOutDate,
  }
}

/**
 * Formata data para exibição brasileira
 */
export function formatBrazilianDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Formata data para input type="date" (YYYY-MM-DD)
 */
export function formatISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

