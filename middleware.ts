import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Proteger rotas do admin (exceto login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login') {
    // Em produção, verificar token JWT ou sessão
    // Por enquanto, apenas redireciona se não houver user no localStorage
    // Isso será verificado no cliente
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}





