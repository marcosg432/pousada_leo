# Solução de Problemas - Conexão com Banco de Dados

## Erro: "A conexão de localhost foi recusada"

Este erro geralmente ocorre quando o banco de dados não está rodando ou a configuração está incorreta.

### Solução 1: Verificar se o PostgreSQL está rodando

**Windows:**
```powershell
# Verificar se o serviço está rodando
Get-Service -Name postgresql*

# Se não estiver rodando, inicie o serviço
Start-Service -Name postgresql-x64-14  # Ajuste o nome conforme sua versão
```

**Linux/Mac:**
```bash
# Verificar status
sudo systemctl status postgresql

# Iniciar se necessário
sudo systemctl start postgresql
```

### Solução 2: Verificar o arquivo .env

Certifique-se de que o arquivo `.env` existe na raiz do projeto e contém:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pousada_leo?schema=public"
```

**Verifique:**
- ✅ O arquivo `.env` existe na raiz do projeto
- ✅ O usuário e senha estão corretos
- ✅ A porta está correta (5432 para PostgreSQL, 3306 para MySQL)
- ✅ O nome do banco está correto

### Solução 3: Criar o banco de dados

Se o banco de dados não existe, crie-o:

**PostgreSQL:**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco
CREATE DATABASE pousada_leo;

# Sair
\q
```

**MySQL:**
```bash
# Conectar ao MySQL
mysql -u root -p

# Criar o banco
CREATE DATABASE pousada_leo;

# Sair
exit
```

### Solução 4: Usar SQLite (Mais Simples para Desenvolvimento)

Se você não tem PostgreSQL instalado ou quer algo mais simples, use SQLite:

1. Altere o `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. No arquivo `.env`, remova ou comente a linha `DATABASE_URL`

3. Execute:
```bash
npx prisma generate
npx prisma db push
npm run db:init
```

### Solução 5: Testar a conexão

Teste se a conexão está funcionando:

```bash
# Para PostgreSQL
psql -U seu_usuario -d pousada_leo -h localhost

# Para MySQL
mysql -u seu_usuario -p pousada_leo -h localhost
```

### Solução 6: Verificar firewall

Se estiver usando Windows, verifique se o firewall não está bloqueando a porta:

```powershell
# Verificar regras do firewall
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*PostgreSQL*"}
```

## Alternativa: Usar SQLite (Recomendado para Desenvolvimento)

SQLite é mais simples porque:
- ✅ Não precisa de servidor rodando
- ✅ Arquivo único (dev.db)
- ✅ Perfeito para desenvolvimento
- ✅ Fácil de fazer backup (só copiar o arquivo)

Veja a Solução 4 acima para configurar.



