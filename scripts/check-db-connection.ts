import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkConnection() {
  try {
    console.log('🔍 Verificando conexão com o banco de dados...\n')
    
    // Tentar conectar
    await prisma.$connect()
    console.log('✅ Conexão estabelecida com sucesso!\n')
    
    // Testar uma query simples
    const userCount = await prisma.user.count()
    console.log(`📊 Usuários no banco: ${userCount}`)
    
    const roomCount = await prisma.room.count()
    console.log(`📊 Quartos no banco: ${roomCount}`)
    
    console.log('\n✨ Banco de dados está funcionando corretamente!')
    
  } catch (error: any) {
    console.error('\n❌ Erro ao conectar com o banco de dados:\n')
    console.error(error.message)
    
    if (error.message.includes('P1001')) {
      console.error('\n💡 Dica: O servidor de banco de dados não está rodando.')
      console.error('   - Verifique se o PostgreSQL/MySQL está iniciado')
      console.error('   - Verifique a URL de conexão no arquivo .env')
    } else if (error.message.includes('P1000')) {
      console.error('\n💡 Dica: Erro de autenticação.')
      console.error('   - Verifique usuário e senha no arquivo .env')
    } else if (error.message.includes('P1003')) {
      console.error('\n💡 Dica: O banco de dados não existe.')
      console.error('   - Crie o banco de dados primeiro')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkConnection()





