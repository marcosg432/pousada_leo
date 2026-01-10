import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Atualizando Suíte 2 no banco de dados...')

  // Buscar o quarto 102 (Quarto Superior)
  const room = await prisma.room.findUnique({
    where: { number: '102' },
  })

  if (!room) {
    console.log('❌ Quarto 102 não encontrado. Execute primeiro: npm run db:init')
    return
  }

  // Atualizar o quarto
  await prisma.room.update({
    where: { id: room.id },
    data: {
      name: 'Suíte 2',
      description: 'Essa é a suíte 2! Ela acomoda até 6 pessoas em uma cama de casal e duas beliches. Possui banheiro privativo com chuveiro quente, ar condicionado, ventilador, TV com netflix, wifi, frigobar e micro-ondas. Lençóis, toalhas, travesseiros e cobertas Inclusos!',
      capacity: 6,
      amenities: JSON.stringify([
        'WiFi',
        'TV com Netflix',
        'Ar condicionado',
        'Ventilador',
        'Frigobar',
        'Micro-ondas',
        'Banheiro privativo',
        'Chuveiro quente',
        'Lençóis',
        'Toalhas',
        'Travesseiros',
        'Cobertas',
      ]),
      images: JSON.stringify([
        '/rooms/suite-2/suite-2-4.jpeg',
        '/rooms/suite-2/suite-2-1.jpeg',
        '/rooms/suite-2/suite-2-2.jpeg',
        '/rooms/suite-2/suite-2-3.jpeg',
        '/rooms/suite-2/suite-2-5.jpeg',
        '/rooms/suite-2/suite-2-6.jpeg',
        '/rooms/suite-2/suite-2-7.jpeg',
        '/rooms/suite-2/suite-2-8.jpeg',
        '/rooms/suite-2/suite-2-9.jpeg',
        '/rooms/suite-2/suite-2-10.jpeg',
        '/rooms/suite-2/suite-2-11.jpeg',
        '/rooms/suite-2/suite-2-12.jpeg',
      ]),
    },
  })

  console.log('✅ Suíte 2 atualizada com sucesso!')
  console.log('   - Nome: Suíte 2')
  console.log('   - Capacidade: 6 pessoas')
  console.log('   - Imagens: 12 imagens adicionadas')
}

main()
  .catch((e) => {
    console.error('Erro ao atualizar:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

