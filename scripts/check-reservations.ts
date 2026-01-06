import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando reservas no banco de dados...\n')

  try {
    const reservations = await prisma.reservation.findMany({
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
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`📊 Total de reservas: ${reservations.length}\n`)

    if (reservations.length === 0) {
      console.log('❌ Nenhuma reserva encontrada no banco de dados!')
      return
    }

    reservations.forEach((reservation, index) => {
      console.log(`\n--- Reserva ${index + 1} ---`)
      console.log(`ID: ${reservation.id}`)
      console.log(`Hóspede: ${reservation.guest.name}`)
      console.log(`Email: ${reservation.guest.email || 'N/A'}`)
      console.log(`Telefone: ${reservation.guest.phone}`)
      console.log(`Quarto: ${reservation.room.name} (${reservation.room.number})`)
      console.log(`Check-in: ${new Date(reservation.checkIn).toLocaleDateString('pt-BR')}`)
      console.log(`Check-out: ${new Date(reservation.checkOut).toLocaleDateString('pt-BR')}`)
      console.log(`Status: ${reservation.status}`)
      console.log(`Fonte: ${reservation.source}`)
      console.log(`Valor total: R$ ${reservation.totalPrice.toFixed(2)}`)
      console.log(`Valor pago: R$ ${reservation.paidAmount.toFixed(2)} (${reservation.paidPercentage.toFixed(1)}%)`)
      console.log(`Criada em: ${new Date(reservation.createdAt).toLocaleString('pt-BR')}`)
    })
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    console.error('Detalhes:', error)
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
