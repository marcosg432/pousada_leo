#!/bin/bash

echo "=== Verificando processos PM2 ==="
pm2 list

echo ""
echo "=== Verificando portas em uso ==="
netstat -tulpn | grep LISTEN | awk '{print $4}' | cut -d: -f2 | sort -n | uniq

echo ""
echo "=== Verificando processos Node.js ==="
ps aux | grep node | grep -v grep

echo ""
echo "=== Verificando uso de memória ==="
free -h

echo ""
echo "=== Verificando espaço em disco ==="
df -h

