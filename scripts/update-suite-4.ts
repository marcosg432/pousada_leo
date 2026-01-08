import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Atualizando Suíte 4 no banco de dados...')

  // Buscar o quarto 104 (Suíte 4)
  const room = await prisma.room.findUnique({
    where: { number: '104' },
  })

  if (!room) {
    console.log('❌ Quarto 104 não encontrado. Execute primeiro: npm run db:init')
    return
  }

  // Atualizar o quarto
  await prisma.room.update({
    where: { id: room.id },
    data: {
      name: 'Suíte 4',
      description: 'Quarto aconchegante e moderno, ideal para casais ou pequenas famílias. Ambiente acolhedor com todas as comodidades necessárias para uma estadia confortável.',
      capacity: 5,
      price: 190,
      amenities: JSON.stringify([
        'WiFi gratuito',
        'TV',
        'Ar condicionado',
        'Banheiro privativo',
        'Frigobar',
        'Micro-ondas',
        'Cama de casal',
        'Roupas de cama',
        'Toalhas',
      ]),
      images: JSON.stringify([
        '/rooms/suite-4/suite-4-5.jpeg',
        '/rooms/suite-4/suite-4-1.jpeg',
        '/rooms/suite-4/suite-4-2.jpeg',
        '/rooms/suite-4/suite-4-3.jpeg',
        '/rooms/suite-4/suite-4-4.jpeg',
        '/rooms/suite-4/suite-4-6.jpeg',
        '/rooms/suite-4/suite-4-7.jpeg',
      ]),
    },
  })

  console.log('✅ Suíte 4 atualizada com sucesso!')
  console.log('   - Nome: Suíte 4')
  console.log('   - Capacidade: 5 pessoas')
  console.log('   - Preço: R$ 190')
  console.log('   - Imagens: 7 imagens adicionadas')
}

main()
  .catch((e) => {
    console.error('Erro ao atualizar:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

