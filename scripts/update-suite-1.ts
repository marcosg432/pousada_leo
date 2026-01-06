import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Atualizando Suíte 1 no banco de dados...')

  // Buscar o quarto 101 (Quarto Standard)
  const room = await prisma.room.findUnique({
    where: { number: '101' },
  })

  if (!room) {
    console.log('❌ Quarto 101 não encontrado. Execute primeiro: npm run db:init')
    return
  }

  // Atualizar o quarto
  await prisma.room.update({
    where: { id: room.id },
    data: {
      name: 'Suíte 1',
      description: 'Acomodações Confortáveis: A Pousada do Leô em Mangaratiba oferece quartos familiares com banheiros privativos, ar-condicionado e WiFi gratuito. Cada quarto inclui geladeira, micro-ondas, TV e chaleira elétrica. Comodidades Convenientes: Os hóspedes se beneficiam de um serviço pago de traslado para o aeroporto, recepção 24 horas e serviços de streaming. A pousada possui um pátio interno e vista para uma rua tranquila, garantindo uma estadia pacífica.',
      capacity: 8,
      amenities: JSON.stringify([
        'WiFi gratuito',
        'TV',
        'Ar condicionado',
        'Banheiro privativo',
        'Geladeira',
        'Micro-ondas',
        'Chaleira elétrica',
        'Serviço de streaming',
        'Recepção 24h',
        'Pátio interno',
        'Vista para rua tranquila',
      ]),
      images: JSON.stringify([
        '/rooms/suite-1/suite-1-5.jpg',
        '/rooms/suite-1/suite-1-1.jpg',
        '/rooms/suite-1/suite-1-2.jpg',
        '/rooms/suite-1/suite-1-3.jpg',
        '/rooms/suite-1/suite-1-4.jpg',
        '/rooms/suite-1/suite-1-6.jpg',
        '/rooms/suite-1/suite-1-7.jpg',
        '/rooms/suite-1/suite-1-8.jpg',
        '/rooms/suite-1/suite-1-9.jpg',
        '/rooms/suite-1/suite-1-10.jpg',
        '/rooms/suite-1/suite-1-11.jpg',
      ]),
    },
  })

  console.log('✅ Suíte 1 atualizada com sucesso!')
  console.log('   - Nome: Suíte 1')
  console.log('   - Capacidade: 8 pessoas')
  console.log('   - Imagens: 11 imagens adicionadas')
}

main()
  .catch((e) => {
    console.error('Erro ao atualizar:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

