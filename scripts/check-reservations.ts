import { PrismaClient } from '@prisma/client'
import { startOfMonth, endOfMonth } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  console.log('🔍 Verificando reservas no banco de dados...\n')
  console.log(`Período do mês atual: ${monthStart.toLocaleDateString('pt-BR')} até ${monthEnd.toLocaleDateString('pt-BR')}\n`)

  // Buscar todas as reservas
  const allReservations = await prisma.reservation.findMany({
    include: {
      room: {
        select: {
          number: true,
          name: true,
        },
      },
      guest: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  console.log(`📊 Total de reservas no banco: ${allReservations.length}\n`)

  if (allReservations.length === 0) {
    console.log('❌ Nenhuma reserva encontrada no banco de dados')
    return
  }

  // Mostrar detalhes de cada reserva
  allReservations.forEach((res, index) => {
    console.log(`\n--- Reserva ${index + 1} ---`)
    console.log(`ID: ${res.id}`)
    console.log(`Hóspede: ${res.guest.name}`)
    console.log(`Quarto: ${res.room.number} - ${res.room.name}`)
    console.log(`Status: ${res.status}`)
    console.log(`Check-in: ${res.checkIn.toLocaleDateString('pt-BR')}`)
    console.log(`Check-out: ${res.checkOut.toLocaleDateString('pt-BR')}`)
    console.log(`Total Price: R$ ${res.totalPrice.toFixed(2)}`)
    console.log(`Base Price: R$ ${res.basePrice.toFixed(2)}`)
    console.log(`Extra Price: R$ ${res.extraPrice.toFixed(2)}`)
    console.log(`Criada em: ${res.createdAt.toLocaleDateString('pt-BR')}`)
    
    // Verificar se está no mês atual
    const checkInInMonth = res.checkIn >= monthStart && res.checkIn <= monthEnd
    const checkOutInMonth = res.checkOut >= monthStart && res.checkOut <= monthEnd
    const spansMonth = res.checkIn <= monthStart && res.checkOut >= monthEnd
    
    console.log(`\n📅 Verificação de datas:`)
    console.log(`  - Check-in no mês: ${checkInInMonth ? '✅' : '❌'}`)
    console.log(`  - Check-out no mês: ${checkOutInMonth ? '✅' : '❌'}`)
    console.log(`  - Abrange o mês: ${spansMonth ? '✅' : '❌'}`)
    
    // Verificar se seria contabilizada
    const isConfirmed = ['confirmed', 'checked_in', 'checked_out'].includes(res.status)
    const wouldCount = isConfirmed && (checkInInMonth || checkOutInMonth || spansMonth)
    
    console.log(`\n💰 Seria contabilizada no faturamento: ${wouldCount ? '✅ SIM' : '❌ NÃO'}`)
    if (!wouldCount) {
      if (!isConfirmed) {
        console.log(`   Motivo: Status não é confirmado/check-in/check-out (status atual: ${res.status})`)
      } else {
        console.log(`   Motivo: Datas não estão no mês atual`)
      }
    }
  })

  // Calcular faturamento esperado
  console.log(`\n\n📊 RESUMO DO FATURAMENTO DO MÊS:\n`)
  
  const confirmedReservations = allReservations.filter((res) => {
    const isConfirmed = ['confirmed', 'checked_in', 'checked_out'].includes(res.status)
    const checkInInMonth = res.checkIn >= monthStart && res.checkIn <= monthEnd
    const checkOutInMonth = res.checkOut >= monthStart && res.checkOut <= monthEnd
    const spansMonth = res.checkIn <= monthStart && res.checkOut >= monthEnd
    
    return isConfirmed && (checkInInMonth || checkOutInMonth || spansMonth)
  })

  console.log(`Reservas que deveriam ser contabilizadas: ${confirmedReservations.length}`)
  
  const totalRevenue = confirmedReservations.reduce((sum, res) => sum + res.totalPrice, 0)
  
  console.log(`Faturamento esperado: R$ ${totalRevenue.toFixed(2)}`)
  
  if (confirmedReservations.length > 0) {
    console.log(`\nDetalhes:`)
    confirmedReservations.forEach((res) => {
      console.log(`  - ${res.guest.name} (${res.room.number}): R$ ${res.totalPrice.toFixed(2)}`)
    })
  }
}

main()
  .catch((e) => {
    console.error('Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


