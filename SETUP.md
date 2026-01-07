# 🚀 Setup Completo - Pousada do Leô

## Configuração Rápida com SQLite

Siga estes passos na ordem:

### 1. Instalar dependências
```bash
npm install
```

### 2. Gerar o cliente Prisma
```bash
npm run db:generate
```

### 3. Criar o banco de dados
```bash
npm run db:push
```

### 4. Inicializar com dados
```bash
npm run db:init
```

Isso criará:
- ✅ Usuário admin: `admin@pousadaleo.com` / `admin123`
- ✅ 3 quartos de exemplo

### 5. Iniciar o servidor
```bash
npm run dev
```

### 6. Acessar

- **Site institucional:** http://localhost:3000
- **Painel admin:** http://localhost:3000/admin/login
  - Email: `admin@pousadaleo.com`
  - Senha: `admin123`

---

## Comandos Úteis

```bash
# Verificar conexão com banco
npm run db:check

# Abrir Prisma Studio (visualizar dados)
npm run db:studio

# Gerar cliente Prisma (após mudanças no schema)
npm run db:generate

# Aplicar mudanças no schema
npm run db:push
```

---

## Estrutura do Banco (SQLite)

O banco de dados será criado em: `prisma/dev.db`

**Modelos:**
- `users` - Usuários do sistema
- `rooms` - Quartos da pousada
- `guests` - Hóspedes
- `reservations` - Reservas
- `payments` - Pagamentos
- `settings` - Configurações

---

## Problemas?

Se encontrar algum erro:

1. **Delete o banco antigo:**
   ```bash
   # Windows PowerShell
   Remove-Item prisma\dev.db -ErrorAction SilentlyContinue
   
   # Linux/Mac
   rm prisma/dev.db
   ```

2. **Recrie tudo:**
   ```bash
   npm run db:push
   npm run db:init
   ```

3. **Verifique a conexão:**
   ```bash
   npm run db:check
   ```

---

## Pronto! 🎉

Agora você pode testar o sistema completo!





