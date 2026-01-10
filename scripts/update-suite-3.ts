import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Atualizando Suíte 3 no banco de dados...')

  // Buscar o quarto 205 (Suíte 3)
  const room = await prisma.room.findUnique({
    where: { number: '205' },
  })

  if (!room) {
    console.log('❌ Quarto 205 não encontrado. Execute primeiro: npm run db:init')
    return
  }

  // Atualizar o quarto
  await prisma.room.update({
    where: { id: room.id },
    data: {
      name: 'Suíte 3',
      description: 'Suíte espaçosa com cama extra, ideal para famílias que buscam conforto, espaço e comodidade para todos.',
      capacity: 5,
      price: 190,
      amenities: JSON.stringify([
        'WiFi gratuito',
        'TV LED 43"',
        'Ar condicionado',
        'Varanda privativa',
        'Banheiro privativo',
        'Frigobar',
        'Cama extra',
        'Roupas de cama',
        'Toalhas',
        'Área de descanso',
      ]),
      images: JSON.stringify([
        '/rooms/suite-3/suite-3-5.jpeg',
        '/rooms/suite-3/suite-3-1.jpeg',
        '/rooms/suite-3/suite-3-2.jpeg',
        '/rooms/suite-3/suite-3-3.jpeg',
      ]),
    },
  })

  console.log('✅ Suíte 3 atualizada com sucesso!')
  console.log('   - Nome: Suíte 3')
  console.log('   - Capacidade: 5 pessoas')
  console.log('   - Preço: R$ 190')
  console.log('   - Imagens: 4 imagens adicionadas')
}

main()
  .catch((e) => {
    console.error('Erro ao atualizar:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



