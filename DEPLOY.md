# 🚀 Guia de Deploy para Hostinger

## Pré-requisitos

- Acesso SSH ao servidor (root@193.160.119.67)
- Node.js instalado (versão 18 ou superior)
- PM2 instalado globalmente
- Git instalado

## Passo 1: Verificar Ambiente no Servidor

Conecte-se ao servidor e execute:

```bash
ssh root@193.160.119.67
```

### Verificar portas em uso:

```bash
# Ver todas as portas em uso
netstat -tulpn | grep LISTEN

# Ver processos PM2
pm2 list

# Ver processos Node.js
ps aux | grep node | grep -v grep
```

**⚠️ IMPORTANTE:** Anote quais portas estão em uso para não conflitar com outros projetos!

## Passo 2: Escolher Porta

⚠️ **PORTAS PROTEGIDAS (NÃO USAR):** 3000, 3001, 3002, 3003, 3004, 3005

O projeto está configurado para usar a porta **3006** por padrão.

Se precisar alterar, edite o arquivo `ecosystem.config.js`:

```javascript
args: 'start -p 3006', // ou outra porta disponível (3007, 3008, etc.)
env: {
  PORT: 3006 // mesma porta aqui
}
```

## Passo 3: Preparar Diretório no Servidor

```bash
# Criar diretório (se não existir)
mkdir -p /var/www/pousada-leo
cd /var/www/pousada-leo

# Se já existe, fazer pull das atualizações
git pull origin main

# Se é a primeira vez, clonar:
# git clone https://github.com/marcosg432/pousada_leo.git .
```

## Passo 4: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar variáveis
nano .env
```

Configure as seguintes variáveis:

```env
# Database (PostgreSQL ou SQLite)
DATABASE_URL="postgresql://user:password@localhost:5432/pousada_leo?schema=public"
# ou para SQLite:
# DATABASE_URL="file:./dev.db"

# Next.js
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://seu-dominio.com
NEXT_PUBLIC_WHATSAPP=21964154637

# Cron (opcional, para lembretes)
CRON_SECRET=seu-secret-aqui
```

## Passo 5: Instalar Dependências e Configurar Banco

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Configurar banco de dados
npx prisma db push

# Inicializar banco (criar admin e quartos)
npm run db:init
```

## Passo 6: Build do Projeto

```bash
npm run build
```

## Passo 7: Deploy com PM2

### Opção A: Usar script automatizado

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Opção B: Manual

```bash
# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar para iniciar no boot
pm2 startup
# (execute o comando que aparecer)
```

## Passo 8: Verificar Status

```bash
# Ver processos PM2
pm2 list

# Ver logs
pm2 logs pousada-leo

# Ver logs em tempo real
pm2 logs pousada-leo --lines 50

# Ver informações detalhadas
pm2 show pousada-leo
```

## Comandos Úteis PM2

```bash
# Reiniciar aplicação
pm2 restart pousada-leo

# Parar aplicação
pm2 stop pousada-leo

# Deletar aplicação
pm2 delete pousada-leo

# Ver uso de recursos
pm2 monit

# Ver logs de erro
pm2 logs pousada-leo --err

# Ver logs de output
pm2 logs pousada-leo --out
```

## Atualizações Futuras

Para atualizar o projeto após fazer mudanças:

```bash
cd /var/www/pousada-leo
git pull origin main
npm install
npx prisma generate
npm run build
pm2 restart pousada-leo
```

Ou use o script automatizado:

```bash
cd /var/www/pousada-leo
./scripts/deploy.sh
```

## Configurar Nginx (Opcional)

Se quiser usar um domínio e HTTPS, configure Nginx como proxy reverso:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000; # ou a porta escolhida
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Porta já em uso

```bash
# Ver qual processo está usando a porta
lsof -i :3000

# Matar processo (CUIDADO!)
kill -9 <PID>
```

### Erro de permissão

```bash
# Dar permissões ao diretório
chown -R root:root /var/www/pousada-leo
chmod -R 755 /var/www/pousada-leo
```

### PM2 não inicia

```bash
# Ver logs de erro
pm2 logs pousada-leo --err

# Verificar se Node.js está instalado
node -v
npm -v

# Verificar se o build foi feito
ls -la .next
```

### Banco de dados não conecta

```bash
# Verificar string de conexão
cat .env | grep DATABASE_URL

# Testar conexão
npm run db:check
```

## Segurança

- ✅ Nunca commite o arquivo `.env`
- ✅ Use senhas fortes no banco de dados
- ✅ Configure firewall para proteger portas
- ✅ Use HTTPS em produção
- ✅ Mantenha dependências atualizadas

