import { PrismaClient } from '@prisma/client'
import { differenceInDays } from 'date-fns'
import { calculateReservationPrice } from '../lib/pricing'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Corrigindo preços das reservas...\n')

  // Buscar todas as reservas com preço zero
  const reservations = await prisma.reservation.findMany({
    where: {
      totalPrice: 0,
    },
    include: {
      room: true,
    },
  })

  console.log(`📊 Encontradas ${reservations.length} reservas com preço zero\n`)

  if (reservations.length === 0) {
    console.log('✅ Todas as reservas já têm preços definidos!')
    return
  }

  let updated = 0
  let errors = 0

  for (const reservation of reservations) {
    try {
      // Calcular número de noites
      // Usar apenas as datas (sem horário) para calcular noites
      const checkInDate = new Date(reservation.checkIn)
      checkInDate.setHours(0, 0, 0, 0)
      const checkOutDate = new Date(reservation.checkOut)
      checkOutDate.setHours(0, 0, 0, 0)
      
      const nights = differenceInDays(checkOutDate, checkInDate)
      
      if (nights <= 0) {
        console.log(`⚠️  Reserva ${reservation.id}: Número de noites inválido (${nights})`)
        console.log(`   Check-in: ${reservation.checkIn.toISOString()}`)
        console.log(`   Check-out: ${reservation.checkOut.toISOString()}`)
        // Se for 0 noites, considerar como 1 noite (check-in e check-out no mesmo dia)
        const finalNights = nights === 0 ? 1 : nights
        console.log(`   Usando ${finalNights} noite(s)`)
        
        if (finalNights <= 0) {
          errors++
          continue
        }
        
        // Calcular preço usando a função de cálculo
        const pricing = calculateReservationPrice(
          reservation.room.price,
          finalNights,
          reservation.adults,
          reservation.children
        )

        // Atualizar reserva
        const minimumPayment = pricing.totalPrice * 0.5
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            totalPrice: pricing.totalPrice,
            basePrice: pricing.basePrice,
            extraPrice: pricing.extraPrice,
            minimumPayment: minimumPayment,
          },
        })

        console.log(`✅ Reserva ${reservation.id} atualizada:`)
        console.log(`   Quarto: ${reservation.room.number} - ${reservation.room.name}`)
        console.log(`   Diária: R$ ${reservation.room.price.toFixed(2)}`)
        console.log(`   Noites: ${finalNights}`)
        console.log(`   Pessoas: ${reservation.adults} adultos, ${reservation.children} crianças`)
        console.log(`   Preço base: R$ ${pricing.basePrice.toFixed(2)}`)
        console.log(`   Preço extra: R$ ${pricing.extraPrice.toFixed(2)}`)
        console.log(`   Total: R$ ${pricing.totalPrice.toFixed(2)}\n`)

        updated++
        continue
      }

      // Calcular preço usando a função de cálculo
      const pricing = calculateReservationPrice(
        reservation.room.price,
        nights,
        reservation.adults,
        reservation.children
      )

      // Atualizar reserva
      const minimumPayment = pricing.totalPrice * 0.5
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          totalPrice: pricing.totalPrice,
          basePrice: pricing.basePrice,
          extraPrice: pricing.extraPrice,
          minimumPayment: minimumPayment,
        },
      })

      console.log(`✅ Reserva ${reservation.id} atualizada:`)
      console.log(`   Quarto: ${reservation.room.number} - ${reservation.room.name}`)
      console.log(`   Diária: R$ ${reservation.room.price.toFixed(2)}`)
      console.log(`   Noites: ${nights}`)
      console.log(`   Pessoas: ${reservation.adults} adultos, ${reservation.children} crianças`)
      console.log(`   Preço base: R$ ${pricing.basePrice.toFixed(2)}`)
      console.log(`   Preço extra: R$ ${pricing.extraPrice.toFixed(2)}`)
      console.log(`   Total: R$ ${pricing.totalPrice.toFixed(2)}\n`)

      updated++
    } catch (error) {
      console.error(`❌ Erro ao atualizar reserva ${reservation.id}:`, error)
      errors++
    }
  }

  console.log(`\n📊 Resumo:`)
  console.log(`   ✅ Atualizadas: ${updated}`)
  console.log(`   ❌ Erros: ${errors}`)
  console.log(`\n✨ Processo concluído!`)
}

main()
  .catch((e) => {
    console.error('Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

