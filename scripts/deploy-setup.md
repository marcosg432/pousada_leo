# Guia de Deploy para Hostinger

## 1. Conectar ao servidor

```bash
ssh root@193.160.119.67
```

## 2. Verificar portas e processos existentes

Execute no servidor:

```bash
# Ver processos PM2
pm2 list

# Ver portas em uso
netstat -tulpn | grep LISTEN

# Ver processos Node.js
ps aux | grep node | grep -v grep
```

## 3. Escolher uma porta disponível

O Next.js por padrão usa a porta 3000. Se estiver ocupada, escolha outra (ex: 3001, 3002, etc.)

## 4. Preparar o ambiente no servidor

```bash
# Criar diretório do projeto
mkdir -p /var/www/pousada-leo
cd /var/www/pousada-leo

# Clonar o repositório
git clone https://github.com/marcosg432/pousada_leo.git .

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Configurar variáveis de ambiente
cp .env.example .env
nano .env  # Editar com as configurações do servidor
```

## 5. Configurar banco de dados

```bash
# Executar migrations
npx prisma db push

# Inicializar banco (se necessário)
npm run db:init
```

## 6. Build do projeto

```bash
npm run build
```

## 7. Configurar PM2

Criar arquivo `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'pousada-leo',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000', // ou a porta escolhida
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

## 8. Iniciar com PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Para iniciar automaticamente no boot
```

## 9. Configurar Nginx (se necessário)

Se precisar de proxy reverso, configurar Nginx para apontar para a porta do Next.js.



