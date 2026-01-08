import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Atualizando todos os quartos no banco de dados...\n')

  try {
    // 1. Remover Quarto Fundos (103)
    console.log('1️⃣ Removendo Quarto Fundos (103)...')
    const quartoFundos = await prisma.room.findUnique({
      where: { number: '103' },
    })
    if (quartoFundos) {
      await prisma.room.delete({
        where: { id: quartoFundos.id },
      })
      console.log('   ✅ Quarto 103 (Quarto Fundos) removido\n')
    } else {
      console.log('   ℹ️  Quarto 103 não encontrado (já foi removido)\n')
    }

    // 2. Atualizar Suíte 1 (101)
    console.log('2️⃣ Atualizando Suíte 1 (101)...')
    const suite1 = await prisma.room.findUnique({
      where: { number: '101' },
    })
    if (suite1) {
      await prisma.room.update({
        where: { id: suite1.id },
        data: {
          name: 'Suíte 1',
          description: 'Acomodações Confortáveis: A Pousada do Leô em Mangaratiba oferece quartos familiares com banheiros privativos, ar-condicionado e WiFi gratuito. Cada quarto inclui frigobar, micro-ondas, TV e chaleira elétrica. Comodidades Convenientes: Os hóspedes se beneficiam de um serviço pago de traslado para o aeroporto, recepção 24 horas e serviços de streaming. A pousada possui um pátio interno e vista para uma rua tranquila, garantindo uma estadia pacífica.',
          capacity: 5,
          amenities: JSON.stringify([
            'WiFi gratuito',
            'TV',
            'Ar condicionado',
            'Banheiro privativo',
            'Frigobar',
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
      console.log('   ✅ Suíte 1 atualizada (capacidade: 5 pessoas)\n')
    } else {
      console.log('   ⚠️  Quarto 101 não encontrado\n')
    }

    // 3. Atualizar Suíte 3 (205) - era Suíte Familiar
    console.log('3️⃣ Atualizando Suíte 3 (205)...')
    const suite3 = await prisma.room.findUnique({
      where: { number: '205' },
    })
    if (suite3) {
      await prisma.room.update({
        where: { id: suite3.id },
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
      console.log('   ✅ Suíte 3 atualizada (capacidade: 5, preço: R$ 190)\n')
    } else {
      console.log('   ⚠️  Quarto 205 não encontrado\n')
    }

    // 4. Atualizar Suíte 4 (104) - era antiga Suíte 3
    console.log('4️⃣ Atualizando Suíte 4 (104)...')
    const suite4 = await prisma.room.findUnique({
      where: { number: '104' },
    })
    if (suite4) {
      await prisma.room.update({
        where: { id: suite4.id },
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
      console.log('   ✅ Suíte 4 atualizada (capacidade: 5, preço: R$ 190)\n')
    } else {
      console.log('   ⚠️  Quarto 104 não encontrado\n')
    }

    console.log('✨ Todas as atualizações concluídas com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao atualizar quartos:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Erro fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

