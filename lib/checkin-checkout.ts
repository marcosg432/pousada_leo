// Helpers para horários de check-in e check-out

import { setHours, setMinutes, startOfDay, isAfter, isBefore, isSameDay } from 'date-fns'

/**
 * Horários padrão da pousada
 */
export const CHECK_IN_HOUR = 14 // 14:00
export const CHECK_OUT_HOUR = 12 // 12:00

/**
 * Aplica horário de check-in (14h) a uma data
 */
export function applyCheckInTime(date: Date): Date {
  return setMinutes(setHours(startOfDay(date), CHECK_IN_HOUR), 0)
}

/**
 * Aplica horário de check-out (12h) a uma data
 */
export function applyCheckOutTime(date: Date): Date {
  return setMinutes(setHours(startOfDay(date), CHECK_OUT_HOUR), 0)
}

/**
 * Obtém mensagem formatada dos horários de check-in/check-out
 */
export function getCheckInOutMessage(): string {
  return `Check-in: a partir das ${CHECK_IN_HOUR}h | Check-out: até ${CHECK_OUT_HOUR}h`
}

