# Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pousada_leo?schema=public"

# NextAuth (se necessário no futuro)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP="21964154637"
```

## Configuração do Banco de Dados

### PostgreSQL
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pousada_leo?schema=public"
```

### MySQL
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/pousada_leo"
```

Substitua:
- `usuario`: seu usuário do banco de dados
- `senha`: sua senha do banco de dados
- `pousada_leo`: nome do banco de dados (pode ser outro)

## WhatsApp

Configure o número do WhatsApp no formato internacional (sem espaços ou caracteres especiais):
```env
NEXT_PUBLIC_WHATSAPP="21964154637"
```



