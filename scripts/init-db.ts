import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Inicializando banco de dados...')

  // Criar usuário admin padrão
  const adminEmail = 'admin@pousadaleo.com'
  const adminPassword = 'admin123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log('✅ Usuário admin criado:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Senha: ${adminPassword}`)
  } else {
    console.log('ℹ️  Usuário admin já existe')
  }

  // Criar alguns quartos de exemplo
const rooms = [
    {
      number: '101',
      name: 'Suíte 1',
      description: 'Acomodações Confortáveis: A Pousada do Leô em Mangaratiba oferece quartos familiares com banheiros privativos, ar-condicionado e WiFi gratuito. Cada quarto inclui frigobar, micro-ondas, TV e chaleira elétrica. Comodidades Convenientes: Os hóspedes se beneficiam de um serviço pago de traslado para o aeroporto, recepção 24 horas e serviços de streaming. A pousada possui um pátio interno e vista para uma rua tranquila, garantindo uma estadia pacífica.',
      capacity: 5,
      price: 200, // Preço base para até 2 pessoas
      type: 'frente',
      amenities: ['WiFi gratuito', 'TV', 'Ar condicionado', 'Banheiro privativo', 'Frigobar', 'Micro-ondas', 'Chaleira elétrica', 'Serviço de streaming', 'Recepção 24h', 'Pátio interno', 'Vista para rua tranquila'],
      images: [
        '/rooms/suite-1/suite-1-1.jpg',
        '/rooms/suite-1/suite-1-2.jpg',
        '/rooms/suite-1/suite-1-3.jpg',
        '/rooms/suite-1/suite-1-4.jpg',
        '/rooms/suite-1/suite-1-5.jpg',
        '/rooms/suite-1/suite-1-6.jpg',
        '/rooms/suite-1/suite-1-7.jpg',
        '/rooms/suite-1/suite-1-8.jpg',
        '/rooms/suite-1/suite-1-9.jpg',
        '/rooms/suite-1/suite-1-10.jpg',
      ],
      status: 'available',
    },
    {
      number: '102',
      name: 'Suíte 2',
      description: 'Essa é a suíte 2! Ela acomoda até 6 pessoas em uma cama de casal e duas beliches. Possui banheiro privativo com chuveiro quente, ar condicionado, ventilador, TV com netflix, wifi, frigobar e micro-ondas. Lençóis, toalhas, travesseiros e cobertas Inclusos!',
      capacity: 6,
      price: 200, // Preço base para até 2 pessoas
      type: 'frente',
      amenities: ['WiFi', 'TV com Netflix', 'Ar condicionado', 'Ventilador', 'Frigobar', 'Micro-ondas', 'Banheiro privativo', 'Chuveiro quente', 'Lençóis', 'Toalhas', 'Travesseiros', 'Cobertas'],
      images: [
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
      ],
      status: 'available',
    },
    {
      number: '205',
      name: 'Suíte 3',
      description: 'Suíte espaçosa com cama extra, ideal para famílias que buscam conforto, espaço e comodidade para todos.',
      capacity: 5,
      price: 190, // Preço base para até 2 pessoas
      type: 'frente',
      amenities: ['WiFi gratuito', 'TV LED 43"', 'Ar condicionado', 'Varanda privativa', 'Banheiro privativo', 'Frigobar', 'Cama extra', 'Roupas de cama', 'Toalhas', 'Área de descanso'],
      images: [
        '/rooms/suite-3/suite-3-5.jpeg',
        '/rooms/suite-3/suite-3-1.jpeg',
        '/rooms/suite-3/suite-3-2.jpeg',
        '/rooms/suite-3/suite-3-3.jpeg',
      ],
      status: 'available',
    },
    {
      number: '104',
      name: 'Suíte 4',
      description: 'Quarto aconchegante e moderno, ideal para casais ou pequenas famílias. Ambiente acolhedor com todas as comodidades necessárias para uma estadia confortável.',
      capacity: 5,
      price: 190, // Preço base para até 2 pessoas
      type: 'frente',
      amenities: ['WiFi gratuito', 'TV', 'Ar condicionado', 'Banheiro privativo', 'Frigobar', 'Micro-ondas', 'Cama de casal', 'Roupas de cama', 'Toalhas'],
      images: [
        '/rooms/suite-4/suite-4-5.jpeg',
        '/rooms/suite-4/suite-4-1.jpeg',
        '/rooms/suite-4/suite-4-2.jpeg',
        '/rooms/suite-4/suite-4-3.jpeg',
        '/rooms/suite-4/suite-4-4.jpeg',
        '/rooms/suite-4/suite-4-6.jpeg',
        '/rooms/suite-4/suite-4-7.jpeg',
      ],
      status: 'available',
    },
  ]

  // SQLite armazena arrays como JSON strings
  for (const room of rooms) {
    const existingRoom = await prisma.room.findUnique({
      where: { number: room.number },
    })

    if (!existingRoom) {
      const roomData: any = {
        number: room.number,
        name: room.name,
        description: room.description,
        capacity: room.capacity,
        price: room.price,
        type: room.type || null,
        // Converter arrays para JSON strings (SQLite)
        amenities: JSON.stringify(room.amenities),
        images: JSON.stringify(room.images),
        status: room.status,
      }
      
      await prisma.room.create({ data: roomData })
      console.log(`✅ Quarto ${room.number} criado`)
    }
  }

  console.log('\n✨ Inicialização concluída!')
}

main()
  .catch((e) => {
    console.error('Erro ao inicializar:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

