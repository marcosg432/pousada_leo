import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando estrutura do banco de dados...\n')

  try {
    // Tentar uma query simples para verificar se o schema está correto
    const test = await prisma.reservation.findFirst({
      select: {
        id: true,
        status: true,
        totalPrice: true,
        minimumPayment: true,
        paidAmount: true,
      },
    })

    console.log('✅ Schema do banco está correto!')
    console.log('✅ Campos novos estão presentes: minimumPayment, paidAmount, etc.')
    
    if (test) {
      console.log('\n📊 Exemplo de reserva encontrada:')
      console.log(`   ID: ${test.id}`)
      console.log(`   Status: ${test.status}`)
      console.log(`   Total: R$ ${test.totalPrice}`)
      console.log(`   Mínimo: R$ ${test.minimumPayment || 0}`)
      console.log(`   Pago: R$ ${test.paidAmount || 0}`)
    } else {
      console.log('\nℹ️  Nenhuma reserva encontrada no banco')
    }
  } catch (error: any) {
    console.error('❌ Erro ao verificar schema:', error.message)
    
    if (error.message.includes('confirmationPrice')) {
      console.error('\n💡 O campo confirmationPrice ainda está sendo referenciado.')
      console.error('   Execute: npx prisma generate')
      console.error('   E reinicie o servidor Next.js')
    }
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




