import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Migrando reservas para novo sistema de pagamento...\n')

  // Buscar todas as reservas
  const reservations = await prisma.reservation.findMany({
    include: {
      payments: {
        where: {
          status: 'completed',
        },
      },
    },
  })

  console.log(`📊 Encontradas ${reservations.length} reservas para migrar\n`)

  let updated = 0
  let errors = 0

  for (const reservation of reservations) {
    try {
      // Calcular valores
      const totalPrice = reservation.totalPrice
      const minimumPayment = totalPrice * 0.5
      
      // Calcular valor pago a partir dos pagamentos
      const paidAmount = reservation.payments.reduce((sum, p) => sum + p.amount, 0)
      const paidPercentage = totalPrice > 0 ? (paidAmount / totalPrice) * 100 : 0
      const remainingAmount = totalPrice - paidAmount

      // Determinar status correto
      let newStatus = reservation.status
      if (reservation.status === 'pending' || reservation.status === 'pending_payment') {
        if (paidAmount >= minimumPayment) {
          newStatus = 'confirmed'
        } else {
          newStatus = 'pending_payment'
        }
      }

      // Atualizar reserva
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          minimumPayment: minimumPayment,
          paidAmount: paidAmount,
          paidPercentage: Math.round(paidPercentage * 100) / 100,
          remainingAmount: remainingAmount,
          status: newStatus,
        },
      })

      console.log(`✅ Reserva ${reservation.id} atualizada:`)
      console.log(`   Status: ${reservation.status} → ${newStatus}`)
      console.log(`   Valor pago: R$ ${paidAmount.toFixed(2)} (${paidPercentage.toFixed(1)}%)`)
      console.log(`   Restante: R$ ${remainingAmount.toFixed(2)}\n`)

      updated++
    } catch (error) {
      console.error(`❌ Erro ao atualizar reserva ${reservation.id}:`, error)
      errors++
    }
  }

  console.log(`\n📊 Resumo:`)
  console.log(`   ✅ Atualizadas: ${updated}`)
  console.log(`   ❌ Erros: ${errors}`)
  console.log(`\n✨ Migração concluída!`)
}

main()
  .catch((e) => {
    console.error('Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


