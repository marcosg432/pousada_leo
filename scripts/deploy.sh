#!/bin/bash

# Script de deploy para Hostinger
# Execute este script no servidor após fazer git pull

set -e

echo "🚀 Iniciando deploy da Pousada do Leô..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

# Verificar portas em uso
echo -e "${YELLOW}📊 Verificando portas em uso...${NC}"
echo "Portas ocupadas:"
netstat -tulpn | grep LISTEN | awk '{print $4}' | cut -d: -f2 | sort -n | uniq

# Verificar processos PM2
echo -e "\n${YELLOW}📋 Processos PM2 ativos:${NC}"
pm2 list

# Instalar dependências
echo -e "\n${YELLOW}📦 Instalando dependências...${NC}"
npm install

# Gerar Prisma Client
echo -e "\n${YELLOW}🔧 Gerando Prisma Client...${NC}"
npx prisma generate

# Build do projeto
echo -e "\n${YELLOW}🏗️  Fazendo build do projeto...${NC}"
npm run build

# Verificar se o PM2 já está rodando
if pm2 list | grep -q "pousada-leo"; then
    echo -e "\n${YELLOW}🔄 Reiniciando aplicação PM2...${NC}"
    pm2 restart pousada-leo
else
    echo -e "\n${YELLOW}▶️  Iniciando aplicação PM2...${NC}"
    pm2 start ecosystem.config.js
    pm2 save
fi

# Mostrar status
echo -e "\n${GREEN}✅ Deploy concluído!${NC}"
echo -e "\n${YELLOW}📊 Status da aplicação:${NC}"
pm2 list
pm2 logs pousada-leo --lines 20



