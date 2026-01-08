import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Removendo Quarto Fundos (103) do banco de dados...')

  // Buscar o quarto 103
  const room = await prisma.room.findUnique({
    where: { number: '103' },
  })

  if (!room) {
    console.log('ℹ️  Quarto 103 não encontrado. Pode já ter sido removido.')
    return
  }

  // Verificar se há reservas associadas
  const reservations = await prisma.reservation.findMany({
    where: { roomId: room.id },
  })

  if (reservations.length > 0) {
    console.log(`⚠️  Aviso: Existem ${reservations.length} reserva(s) associada(s) ao quarto 103.`)
    console.log('   As reservas não serão removidas, apenas o quarto.')
  }

  // Deletar o quarto
  await prisma.room.delete({
    where: { id: room.id },
  })

  console.log('✅ Quarto 103 (Quarto Fundos) removido com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao remover quarto:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


