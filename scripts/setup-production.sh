#!/bin/bash

# Script completo de setup para produção

set -e

echo "🚀 Configurando Pousada do Leô para produção..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# 1. Parar PM2 se estiver rodando
echo "⏹️  Parando PM2..."
pm2 stop pousada-leo 2>/dev/null || true
pm2 delete pousada-leo 2>/dev/null || true

# 2. Limpar cache
echo "🧹 Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# 3. Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# 4. Criar banco de dados e tabelas
echo "🗄️  Criando banco de dados e tabelas..."
npx prisma db push

# 5. Inicializar dados (admin e quartos)
echo "📊 Inicializando dados..."
npm run db:init

# 6. Build do projeto
echo "🏗️  Fazendo build do projeto..."
npm run build

# 7. Verificar se o build foi bem-sucedido
if [ ! -f ".next/prerender-manifest.json" ]; then
    echo "❌ Erro: Build não gerou os arquivos necessários"
    echo "Verifique os erros acima"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# 8. Iniciar com PM2
echo "▶️  Iniciando com PM2..."
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📊 Status:"
pm2 list | grep pousada-leo

echo ""
echo "📝 Logs:"
pm2 logs pousada-leo --lines 5

echo ""
echo "🌐 Aplicação disponível em: http://193.160.119.67:3006"



