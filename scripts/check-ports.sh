#!/bin/bash

echo "=========================================="
echo "🔍 VERIFICAÇÃO DE PORTAS E PROCESSOS"
echo "=========================================="
echo ""

echo "📊 PORTAS EM USO (LISTEN):"
echo "---------------------------"
netstat -tulpn 2>/dev/null | grep LISTEN | awk '{printf "Porta: %-8s | PID: %-8s | Programa: %s\n", $4, $7, $NF}' | sort -k2 -n
echo ""

echo "📋 PROCESSOS PM2 ATIVOS:"
echo "------------------------"
pm2 list
echo ""

echo "🖥️  PROCESSOS NODE.JS:"
echo "---------------------"
ps aux | grep -E "node|next" | grep -v grep | awk '{printf "PID: %-8s | CPU: %-6s | MEM: %-6s | Comando: %s\n", $2, $3"%", $4"%", $11" "$12" "$13" "$14}'
echo ""

echo "💾 USO DE MEMÓRIA:"
echo "-----------------"
free -h
echo ""

echo "💿 ESPAÇO EM DISCO:"
echo "------------------"
df -h | grep -E "Filesystem|/dev/"
echo ""

echo "🌐 PORTAS MAIS COMUNS EM USO:"
echo "-----------------------------"
echo "Porta 80 (HTTP):"
netstat -tulpn 2>/dev/null | grep ":80 " | grep LISTEN || echo "  ✅ Livre"
echo ""
echo "Porta 443 (HTTPS):"
netstat -tulpn 2>/dev/null | grep ":443 " | grep LISTEN || echo "  ✅ Livre"
echo ""
echo "Porta 3000 (Next.js padrão):"
netstat -tulpn 2>/dev/null | grep ":3000 " | grep LISTEN || echo "  ✅ Livre"
echo ""
echo "Porta 3001:"
netstat -tulpn 2>/dev/null | grep ":3001 " | grep LISTEN || echo "  ✅ Livre"
echo ""
echo "Porta 3002:"
netstat -tulpn 2>/dev/null | grep ":3002 " | grep LISTEN || echo "  ✅ Livre"
echo ""
echo "Porta 3003:"
netstat -tulpn 2>/dev/null | grep ":3003 " | grep LISTEN || echo "  ✅ Livre"
echo ""

echo "=========================================="
echo "✅ Verificação concluída!"
echo "=========================================="
echo ""
echo "💡 DICA: Escolha uma porta que apareça como '✅ Livre' acima"
echo "   ou use uma porta acima de 3003 se todas estiverem ocupadas"

