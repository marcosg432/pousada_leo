#!/bin/bash

# Script para corrigir problemas de build no servidor

echo "🔧 Corrigindo problemas de build..."

# Parar PM2
echo "⏹️  Parando PM2..."
pm2 stop pousada-leo 2>/dev/null || true
pm2 delete pousada-leo 2>/dev/null || true

# Limpar cache e build anterior
echo "🧹 Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# Fazer build novamente
echo "🏗️  Fazendo build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -f ".next/prerender-manifest.json" ]; then
    echo "✅ Build concluído com sucesso!"
    
    # Iniciar com PM2
    echo "▶️  Iniciando com PM2..."
    pm2 start ecosystem.config.js
    pm2 save
    
    echo "✅ Aplicação iniciada!"
    pm2 list
else
    echo "❌ Erro: Build não gerou os arquivos necessários"
    exit 1
fi

