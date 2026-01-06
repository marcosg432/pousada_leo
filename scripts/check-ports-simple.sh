#!/bin/bash

# Script simples para verificar portas - execute no servidor

echo "=== PORTAS EM USO ==="
netstat -tulpn | grep LISTEN

echo ""
echo "=== PROCESSOS PM2 ==="
pm2 list

echo ""
echo "=== PORTAS NODE.JS ==="
lsof -i -P -n | grep LISTEN | grep node

echo ""
echo "=== PORTAS COMUNS (3000-3010) ==="
for port in {3000..3010}; do
    if netstat -tulpn | grep -q ":$port "; then
        echo "❌ Porta $port: OCUPADA"
    else
        echo "✅ Porta $port: LIVRE"
    fi
done

