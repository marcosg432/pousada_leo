import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando quartos no banco de dados...\n')

  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        number: 'asc',
      },
    })

    console.log(`📊 Total de quartos: ${rooms.length}\n`)

    if (rooms.length === 0) {
      console.log('❌ Nenhum quarto cadastrado no banco de dados!')
      console.log('💡 Execute: npm run db:init')
      return
    }

    rooms.forEach((room, index) => {
      console.log(`\n--- Quarto ${index + 1} ---`)
      console.log(`ID: ${room.id}`)
      console.log(`Número: ${room.number}`)
      console.log(`Nome: ${room.name}`)
      console.log(`Status: ${room.status}`)
      console.log(`Capacidade: ${room.capacity} pessoas`)
      console.log(`Preço: R$ ${room.price.toFixed(2)}`)
    })

    // Verificar reservas
    const reservations = await prisma.reservation.findMany({
      where: {
        status: {
          not: 'cancelled',
        },
      },
      include: {
        room: {
          select: {
            number: true,
          },
        },
      },
    })

    console.log(`\n\n📅 Reservas ativas: ${reservations.length}`)
    if (reservations.length > 0) {
      reservations.forEach((res) => {
        console.log(`   - Quarto ${res.room.number}: ${new Date(res.checkIn).toLocaleDateString('pt-BR')} até ${new Date(res.checkOut).toLocaleDateString('pt-BR')}`)
      })
    }
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
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
