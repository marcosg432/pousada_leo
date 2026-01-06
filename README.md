# Pousada do Leô

Sistema completo de gestão para a Pousada do Leô, incluindo site institucional e painel administrativo.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma ORM**
- **Tailwind CSS**
- **SQLite** (configurado por padrão - fácil para desenvolvimento)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- **SQLite** (já incluído, não precisa instalar nada!)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd pousada-leo
```

2. Instale as dependências:
```bash
npm install
```

3. **Configure o banco de dados (SQLite já está configurado!):**

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar banco de dados
npm run db:push

# Inicializar com dados (usuário admin + quartos de exemplo)
npm run db:init
```

**✅ Pronto!** O banco SQLite será criado em `prisma/dev.db`

### Alternativa: PostgreSQL (Para produção)

Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pousada_leo?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP="21964154637"
```

Substitua `user`, `password` e `pousada_leo` pelos seus valores.

Depois:
```bash
npm run db:generate
npm run db:push
npm run db:init
```

**⚠️ Problemas de conexão?** Veja `SOLUCAO_RAPIDA.md` ou `TROUBLESHOOTING.md`

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse:
- Site institucional: http://localhost:3000
- Painel administrativo: http://localhost:3000/admin/login
- Login padrão: `admin@pousadaleo.com` / `admin123`

## 📁 Estrutura do Projeto

```
pousada-leo/
├── app/
│   ├── admin/          # Painel administrativo
│   ├── api/            # API Routes
│   ├── globals.css     # Estilos globais
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página inicial (site institucional)
├── components/
│   ├── admin/          # Componentes do painel
│   └── site/           # Componentes do site
├── lib/
│   ├── auth.ts         # Funções de autenticação
│   └── prisma.ts       # Cliente Prisma
├── prisma/
│   └── schema.prisma   # Schema do banco de dados
└── public/             # Arquivos estáticos
```

## 🎨 Design

### Site Institucional
- Paleta: Azul médio, Amarelo quente, Rosa suave/coral
- Design: Acolhedor, simples e moderno
- Totalmente responsivo (mobile-first)

### Painel Administrativo
- Design: Moderno, limpo e funcional
- Foco em produtividade e usabilidade

## 📊 Funcionalidades

### Site Institucional
- ✅ Header com menu responsivo
- ✅ Banner inicial
- ✅ Seção de quartos
- ✅ Sobre a pousada
- ✅ Diferenciais
- ✅ Galeria
- ✅ Contato
- ✅ Botão flutuante de WhatsApp
- ✅ Footer simples

### Painel Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gestão de reservas
- ✅ Gestão de quartos
- ✅ Gestão de hóspedes
- ✅ Relatórios
- ✅ Configurações
- ✅ Autenticação

## 🔐 Autenticação

O sistema de autenticação atual usa localStorage (apenas para desenvolvimento). Em produção, recomenda-se implementar:
- JWT tokens
- NextAuth.js
- Sessões seguras

## 📝 Próximos Passos

- [ ] Implementar CRUD completo via API
- [ ] Calendário de ocupação visual
- [ ] Sistema de pagamentos
- [ ] Integração com WhatsApp API
- [ ] Sistema de reservas no site
- [ ] Upload de imagens
- [ ] Relatórios avançados
- [ ] Notificações

## 📄 Licença

Este projeto é privado e de uso exclusivo da Pousada do Leô.

