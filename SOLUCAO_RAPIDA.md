# 🚀 Solução Rápida - Erro de Conexão

## Opção 1: Usar SQLite (RECOMENDADO - Mais Fácil)

SQLite não precisa de servidor rodando, é perfeito para desenvolvimento!

### Passos:

1. **Substitua o schema do Prisma:**
```bash
# No Windows PowerShell
Copy-Item prisma\schema.sqlite.prisma prisma\schema.prisma -Force

# No Linux/Mac
cp prisma/schema.sqlite.prisma prisma/schema.prisma
```

2. **Remova ou comente a linha DATABASE_URL do .env:**
```env
# DATABASE_URL="postgresql://..."
```

3. **Gere o cliente Prisma:**
```bash
npm run db:generate
```

4. **Crie o banco de dados:**
```bash
npm run db:push
```

5. **Inicialize com dados:**
```bash
npm run db:init
```

6. **Pronto! Agora pode rodar:**
```bash
npm run dev
```

---

## Opção 2: Corrigir PostgreSQL

### Passo 1: Verificar se o PostgreSQL está rodando

**Windows:**
```powershell
# Ver serviços do PostgreSQL
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# Se não estiver rodando, inicie:
Start-Service postgresql-x64-14  # Ajuste o nome conforme sua versão
```

**Linux/Mac:**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Passo 2: Verificar o arquivo .env

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/pousada_leo?schema=public"
```

**Substitua:**
- `postgres` pelo seu usuário do PostgreSQL
- `SUA_SENHA` pela sua senha do PostgreSQL
- `pousada_leo` pelo nome do banco (pode ser outro)

### Passo 3: Criar o banco de dados

**Windows (PowerShell):**
```powershell
# Conectar ao PostgreSQL
psql -U postgres

# No prompt do PostgreSQL:
CREATE DATABASE pousada_leo;
\q
```

**Linux/Mac:**
```bash
sudo -u postgres psql
CREATE DATABASE pousada_leo;
\q
```

### Passo 4: Testar a conexão

```bash
npm run db:check
```

Se der erro, verifique:
- ✅ PostgreSQL está rodando
- ✅ Usuário e senha estão corretos no .env
- ✅ O banco de dados foi criado

### Passo 5: Configurar o Prisma

```bash
npm run db:generate
npm run db:push
npm run db:init
```

---

## Verificar qual banco está configurado

Olhe o arquivo `prisma/schema.prisma`:

- **PostgreSQL:** `provider = "postgresql"` e `url = env("DATABASE_URL")`
- **SQLite:** `provider = "sqlite"` e `url = "file:./dev.db"`

---

## Ainda com problemas?

Execute o diagnóstico:
```bash
npm run db:check
```

Este comando vai mostrar exatamente qual é o problema!



